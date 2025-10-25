import { lineClient } from '../config/line';
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
      
      // Note: In a real implementation, you would need to maintain a list of
      // group IDs and user IDs that have added the bot. For this example,
      // we'll assume you have a way to get these IDs.
      // You might store them in your database or use LINE's webhook to track them.
      
      console.log('Reminder message:', message);
      
      // For now, we'll just log the message. In production, you would:
      // 1. Get all group IDs and user IDs from your database
      // 2. Send the message to each of them using lineClient.pushMessage()
      
      // Example of how to send to a specific group/user:
      // await lineClient.pushMessage('GROUP_ID_OR_USER_ID', {
      //   type: 'text',
      //   text: message
      // });
      
    } catch (error) {
      console.error('Reminder service error:', error);
      throw error;
    }
  }
}
