import { Request, Response } from 'express';
import { ReminderService } from '../src/services/reminderService';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify the request is from cron-job.org (optional security measure)
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Send reminders - partial success is acceptable (some messages may fail due to rate limits)
    await ReminderService.sendReminder();
    
    // Always return success to prevent cron job from retrying immediately
    // Failed messages will be logged but won't cause the function to fail
    res.status(200).json({ 
      success: true, 
      message: 'Reminder processing completed (check logs for details)',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reminder error:', error);
    // Even on error, return 200 to prevent immediate retry
    // Rate limit errors are temporary and will resolve on next run
    res.status(200).json({ 
      success: false, 
      error: 'Some reminders may have failed due to rate limits',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
