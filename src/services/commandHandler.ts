import { DatabaseService } from './database';
import { MessageFormatter } from './messageFormatter';
import { Command } from './commandParser';

export class CommandHandler {
  static async handleCommand(command: Command): Promise<string> {
    try {
      switch (command.type) {
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
