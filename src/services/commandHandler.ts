import { DatabaseService } from './database';
import { MessageFormatter } from './messageFormatter';
import { Command } from './commandParser';
import { supabase } from '../config/supabase';

export class CommandHandler {
  static async handleCommand(command: Command): Promise<string> {
    try {
      switch (command.type) {
        case 'help':
          return `🤖 聚會助理機器人命令說明

📋 可用命令：

1️⃣ 查看所有安排
   查看聚會助理 全部

2️⃣ 新增安排
   新增聚會助理 2025-11-02 王小明 李大華 陳信宏 林偉翔

3️⃣ 更新安排
   更新聚會助理 1 招待成員1 陳志強

4️⃣ 刪除安排
   刪除聚會助理 1

📝 欄位名稱：
• 招待成員1
• 招待成員2  
• 祝福聖餐弟兄1
• 祝福聖餐弟兄2
• 日期

💡 範例：
新增聚會助理 2025-11-02 王小明 李大華 陳信宏 林偉翔
更新聚會助理 1 招待成員1 陳志強
刪除聚會助理 1

⏰ 提醒：機器人會自動在每週六晚上7點發送提醒訊息`;

        case 'check_subscribers':
          const { data: subscribers, error } = await supabase
            .from('bot_subscribers')
            .select('line_id, type, created_at');
          
          if (error) {
            return `檢查訂閱者時發生錯誤: ${error.message}`;
          }
          
          if (!subscribers || subscribers.length === 0) {
            return '目前沒有訂閱者。請將機器人加入群組或個人聊天。';
          }
          
          const subscriberList = subscribers.map(sub => 
            `• ${sub.type}: ${sub.line_id} (${new Date(sub.created_at).toLocaleString()})`
          ).join('\n');
          
          return `📋 目前訂閱者 (${subscribers.length} 個):\n${subscriberList}`;

        case 'get':
          const assistants = await DatabaseService.getAll();
          return MessageFormatter.formatListMessage(assistants);
          
        case 'add':
          const newAssistant = await DatabaseService.add(command.data);
          return `已成功新增聚會助理安排:\n${MessageFormatter.formatAssistantMessage(newAssistant)}`;
          
        case 'update':
          const updateData: any = {};
          updateData[command.data.field] = command.data.value;
          
          const updatedAssistant = await DatabaseService.update(command.data.id, updateData);
          return `已成功更新聚會助理安排:\n${MessageFormatter.formatAssistantMessage(updatedAssistant)}`;
          
        case 'delete':
          await DatabaseService.delete(command.data.id);
          return `已成功刪除ID為 ${command.data.id} 的聚會助理安排`;
          
        default:
          return '未知的命令格式';
      }
    } catch (error) {
      console.error('Command handling error:', error);
      return `處理命令時發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`;
    }
  }
}
