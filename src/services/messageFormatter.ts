import { MeetingAssistant } from '../types/database';

export class MessageFormatter {
  // Format reminder message for Saturday night
  static formatReminderMessage(assistant: MeetingAssistant): string {
    const date = new Date(assistant.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Get day of week
    const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeek = dayNames[date.getDay()];
    
    return `⛪ 明日聖餐聚會提醒 ⛪

📅 日期：${year}年${month}月${day}日 (${dayOfWeek})

👥 招待人員：
• ${assistant.usher1}
• ${assistant.usher2}

🍞 祝福聖餐：
• ${assistant.sacrament1}
• ${assistant.sacrament2}

⏰ 請準時到達，感謝您的服務！

🙏 願神祝福您們的服務`;
  }

  // Format list message for "查看聚會助理 全部" command
  static formatListMessage(assistants: MeetingAssistant[]): string {
    if (assistants.length === 0) {
      return '📋 目前沒有聚會助理安排';
    }

    return `📋 聚會助理安排總覽\n\n` + assistants.map(assistant => {
      const date = new Date(assistant.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      // Get day of week
      const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dayOfWeek = dayNames[date.getDay()];
      
      return `🆔 ID: ${assistant.id}
📅 日期: ${year}年${month}月${day}日 (${dayOfWeek})
👥 招待: ${assistant.usher1}、${assistant.usher2}
🍞 祝福聖餐: ${assistant.sacrament1}、${assistant.sacrament2}`;
    }).join('\n\n');
  }

  // Format single assistant message
  static formatAssistantMessage(assistant: MeetingAssistant): string {
    const date = new Date(assistant.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Get day of week
    const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dayOfWeek = dayNames[date.getDay()];
    
    return `✅ 聚會助理安排詳情

🆔 ID: ${assistant.id}
📅 日期: ${year}年${month}月${day}日 (${dayOfWeek})
👥 招待: ${assistant.usher1}、${assistant.usher2}
🍞 祝福聖餐: ${assistant.sacrament1}、${assistant.sacrament2}`;
  }
}
