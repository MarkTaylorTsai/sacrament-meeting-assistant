import { lineClient } from '../config/line';
import { supabase } from '../config/supabase';
import { DatabaseService } from './database';
import { MessageFormatter } from './messageFormatter';

export class ReminderService {
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
      
      // Send message to all recipients
      const sendPromises = allRecipients.map(async (recipient) => {
        try {
          await lineClient.pushMessage(recipient.line_id, {
            type: 'text',
            text: message
          });
          console.log(`Message sent to ${recipient.type}: ${recipient.line_id}`);
        } catch (sendError) {
          console.error(`Failed to send message to ${recipient.line_id}:`, sendError);
        }
      });
      
      await Promise.all(sendPromises);
      console.log(`Reminder sent to ${allRecipients.length} recipients`);
      
    } catch (error) {
      console.error('Reminder service error:', error);
      throw error;
    }
  }
}
