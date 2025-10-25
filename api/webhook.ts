import { Request, Response } from 'express';
import { lineClient } from '../src/config/line';
import { supabase } from '../src/config/supabase';
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
      
      // Track when bot is added to groups or users
      if (event.type === 'follow' || event.type === 'memberJoined' || event.type === 'join') {
        const userId = event.source.userId;
        const groupId = event.source.groupId;
        const roomId = event.source.roomId;
        
        console.log(`${event.type} event details:`, {
          userId,
          groupId,
          roomId,
          source: event.source,
          members: event.members
        });
        
        const lineId = groupId || roomId || userId;
        const type = groupId ? 'group' : roomId ? 'group' : 'user';
        
        if (lineId) {
          try {
            const result = await supabase
              .from('bot_subscribers')
              .upsert({
                line_id: lineId,
                type: type
              }, {
                onConflict: 'line_id'
              });
            console.log(`Bot added to ${type}: ${lineId}`, result);
          } catch (error) {
            console.error('Failed to track subscriber:', error);
          }
        } else {
          console.log('No valid LINE ID found in follow event');
        }
      }
      
      // Track when bot is removed from groups
      if (event.type === 'unfollow' || event.type === 'leave' || event.type === 'memberLeft') {
        const groupId = event.source.groupId;
        const roomId = event.source.roomId;
        
        console.log(`${event.type} event details:`, {
          groupId,
          roomId,
          source: event.source
        });
        
        const lineId = groupId || roomId;
        
        if (lineId) {
          try {
            await supabase
              .from('bot_subscribers')
              .delete()
              .eq('line_id', lineId);
            console.log(`Bot removed from group: ${lineId}`);
          } catch (error) {
            console.error('Failed to remove subscriber:', error);
          }
        } else {
          console.log('No valid LINE ID found in leave event');
        }
      }
      
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
          // Not a valid command - do not reply
          console.log('Message received but not a valid command, ignoring');
          // Do not send any reply for non-command messages
        }
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}