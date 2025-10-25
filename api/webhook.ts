import { Request, Response } from 'express';
import { lineClient } from '../src/config/line';
import { CommandParser } from '../src/services/commandParser';
import { CommandHandler } from '../src/services/commandHandler';

export default async function handler(req: Request, res: Response) {
  // Handle LINE webhook verification
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'Webhook endpoint is working' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if body has events
    if (!req.body || !req.body.events) {
      console.log('No events in request body');
      return res.status(200).json({ success: true });
    }

    const events = req.body.events;
    console.log('Received events:', events.length);
    
    for (const event of events) {
      console.log('Processing event:', event.type);
      
      if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text;
        const replyToken = event.replyToken;
        
        console.log('Received message:', text);
        
        // Parse the command
        const command = CommandParser.parse(text);
        console.log('Parsed command:', command);
        
        if (command) {
          try {
            // Handle the command
            const response = await CommandHandler.handleCommand(command);
            console.log('Command response:', response);
            
            // Reply to the user
            await lineClient.replyMessage(replyToken, {
              type: 'text',
              text: response
            });
          } catch (commandError) {
            console.error('Command handling error:', commandError);
            await lineClient.replyMessage(replyToken, {
              type: 'text',
              text: '處理命令時發生錯誤，請稍後再試。'
            });
          }
        } else {
          // Unknown command
          console.log('Unknown command, sending help message');
          await lineClient.replyMessage(replyToken, {
            type: 'text',
            text: '請使用正確的命令格式。輸入「查看聚會助理 全部」查看所有命令。'
          });
        }
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}