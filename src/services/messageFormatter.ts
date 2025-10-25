import { MeetingAssistant } from '../types/database';

export class MessageFormatter {
  // Format reminder message for Saturday night
  static formatReminderMessage(assistant: MeetingAssistant): string {
    const date = new Date(assistant.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `明日聖餐聚會 (${month}/${day})
招待:
• ${assistant.usher1}
• ${assistant.usher2}
祝福聖餐:
• ${assistant.sacrament1}
• ${assistant.sacrament2}`;
  }

  // Format list message for "查看聚會助理 全部" command
  static formatListMessage(assistants: MeetingAssistant[]): string {
    if (assistants.length === 0) {
      return '目前沒有聚會助理安排';
    }

    return assistants.map(assistant => {
      const date = new Date(assistant.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      return `ID: ${assistant.id}
日期: ${year}/${month}/${day}
招待: ${assistant.usher1}、${assistant.usher2}
祝福聖餐: ${assistant.sacrament1}、${assistant.sacrament2}`;
    }).join('\n\n');
  }

  // Format single assistant message
  static formatAssistantMessage(assistant: MeetingAssistant): string {
    const date = new Date(assistant.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `ID: ${assistant.id}
日期: ${year}/${month}/${day}
招待: ${assistant.usher1}、${assistant.usher2}
祝福聖餐: ${assistant.sacrament1}、${assistant.sacrament2}`;
  }
}
