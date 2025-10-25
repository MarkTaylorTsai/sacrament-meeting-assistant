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

    await ReminderService.sendReminder();
    
    res.status(200).json({ 
      success: true, 
      message: 'Reminder sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reminder error:', error);
    res.status(500).json({ 
      error: 'Failed to send reminder',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
