import { lineClient } from '../config/line';
import { supabase } from '../config/supabase';
import { DatabaseService } from './database';
import { MessageFormatter } from './messageFormatter';

// Rate limiting configuration
// LINE Bot API rate limit: ~20 push messages per second
// Using 100ms delay = ~10 messages/second to stay well under the limit
const MESSAGE_DELAY_MS = parseInt(process.env.LINE_MESSAGE_DELAY_MS || '100', 10); // Default: 100ms = ~10 messages/second (conservative)
const MAX_RETRIES = parseInt(process.env.LINE_MAX_RETRIES || '3', 10); // Default: 3 retries (reduced to prevent timeout)
const INITIAL_RETRY_DELAY_MS = parseInt(process.env.LINE_INITIAL_RETRY_DELAY_MS || '1000', 10); // Default: 1 second

export class ReminderService {
  // Utility function to delay execution
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Retry wrapper with exponential backoff for 429 errors
  // Optimized to prevent function timeout (max 30s on Vercel)
  private static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = MAX_RETRIES,
    initialDelay: number = INITIAL_RETRY_DELAY_MS
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // Only retry on 429 errors (rate limiting)
        if (error.statusCode === 429 || error.status === 429) {
          if (attempt < maxRetries) {
            const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s (max ~7s total)
            console.log(`Rate limit hit (429), retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
            await this.delay(delay);
            continue;
          } else {
            // After max retries, skip this recipient to avoid timeout
            // Rate limits reset quickly, but we can't wait in a serverless function
            console.warn(`Max retries (${maxRetries}) reached for rate limit error. Skipping this recipient to prevent timeout. Rate limits reset quickly (usually within minutes).`);
            throw error; // Throw to mark as failed, but don't wait
          }
        }
        
        // For non-429 errors or after max retries, throw immediately
        throw error;
      }
    }
    
    throw lastError;
  }

  // Get tomorrow's date in YYYY-MM-DD format
  static getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  // Send reminder to all groups and personal chats
  static async sendReminder(): Promise<void> {
    try {
      const tomorrowDate = this.getTomorrowDate();
      const assistant = await DatabaseService.getByDate(tomorrowDate);
      
      if (!assistant) {
        console.log(`No meeting assistant found for date: ${tomorrowDate}`);
        return;
      }

      const message = MessageFormatter.formatReminderMessage(assistant);
      console.log('Reminder message:', message);
      
      // Get all LINE IDs from database (groups and users that have added the bot)
      const { data: subscribers, error } = await supabase
        .from('bot_subscribers')
        .select('line_id, type');
      
      if (error) {
        console.error('Failed to fetch subscribers:', error);
        return;
      }
      
      console.log(`Found ${subscribers?.length || 0} subscribers in database:`, subscribers);
      
      // Add admin user ID from environment variable
      const adminUserId = process.env.ADMIN_LINE_USER_ID;
      const allRecipients = [...(subscribers || [])];
      
      if (adminUserId) {
        allRecipients.push({
          line_id: adminUserId,
          type: 'admin'
        });
        console.log('Added admin user to recipients');
      }
      
      console.log(`Total recipients: ${allRecipients.length}`, allRecipients);
      
      if (allRecipients.length === 0) {
        console.log('No subscribers found. Bot needs to be added to groups/users first.');
        return;
      }
      
      // Send message to all recipients sequentially with rate limiting and retry logic
      let successCount = 0;
      let failureCount = 0;
      
      for (const recipient of allRecipients) {
        try {
          // Use retry wrapper with exponential backoff for rate limit errors
          await this.retryWithBackoff(async () => {
            await lineClient.pushMessage(recipient.line_id, {
              type: 'text',
              text: message
            });
          });
          
          console.log(`Message sent to ${recipient.type}: ${recipient.line_id}`);
          successCount++;
          
          // Rate limiting: delay between messages to avoid hitting API limits
          if (MESSAGE_DELAY_MS > 0) {
            await this.delay(MESSAGE_DELAY_MS);
          }
        } catch (sendError: any) {
          failureCount++;
          
          // Handle 429 errors (rate limiting) - these are temporary and reset quickly
          if (sendError.statusCode === 429 || sendError.status === 429) {
            console.error(`Rate limit error for ${recipient.line_id}. Skipping to prevent timeout. Rate limits reset quickly (usually within minutes).`);
            // Add shorter delay after rate limit error to help rate limit reset without causing timeout
            await this.delay(2000); // Wait 2 seconds before trying next recipient (reduced from 5s)
          } else {
            console.error(`Failed to send message to ${recipient.line_id}:`, sendError);
            
            // If it's a 400 error, the user/group might not have the bot
            if (sendError.statusCode === 400 || sendError.status === 400) {
              console.log(`Removing invalid subscriber: ${recipient.line_id}`);
              try {
                await supabase
                  .from('bot_subscribers')
                  .delete()
                  .eq('line_id', recipient.line_id);
              } catch (deleteError) {
                console.error('Failed to remove invalid subscriber:', deleteError);
              }
            }
          }
          
          // Continue processing other recipients even if one fails
          // Still add delay to maintain rate limiting
          if (MESSAGE_DELAY_MS > 0) {
            await this.delay(MESSAGE_DELAY_MS);
          }
        }
      }
      
      console.log(`Reminder processing completed: ${successCount} succeeded, ${failureCount} failed out of ${allRecipients.length} total recipients`);
      
    } catch (error) {
      console.error('Reminder service error:', error);
      throw error;
    }
  }
}
