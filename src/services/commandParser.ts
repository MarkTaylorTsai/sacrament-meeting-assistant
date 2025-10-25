export interface Command {
  type: 'get' | 'add' | 'update' | 'delete' | 'help' | 'check_subscribers' | 'add_group';
  data?: any;
}

export class CommandParser {
  static parse(text: string): Command | null {
    const trimmed = text.trim();
    
    // Only process messages that start with known command prefixes
    if (!trimmed.startsWith('查看聚會助理') && 
        !trimmed.startsWith('新增聚會助理') && 
        !trimmed.startsWith('更新聚會助理') && 
        !trimmed.startsWith('刪除聚會助理') &&
        !trimmed.startsWith('幫助') &&
        !trimmed.startsWith('help') &&
        !trimmed.startsWith('檢查訂閱者') &&
        !trimmed.startsWith('check subscribers') &&
        !trimmed.startsWith('添加群組')) {
      return null;
    }
    
    // Help command
    if (trimmed === '幫助' || trimmed === 'help' || trimmed === '幫助命令') {
      return { type: 'help' };
    }
    
    // Check subscribers command (admin only)
    if (trimmed === '檢查訂閱者' || trimmed === 'check subscribers') {
      return { type: 'check_subscribers' };
    }
    
    // Add group manually command (admin only)
    const addGroupMatch = trimmed.match(/^添加群組\s+(.+)$/);
    if (addGroupMatch) {
      return {
        type: 'add_group',
        data: {
          groupId: addGroupMatch[1]
        }
      };
    }
    
    // Get all command
    if (trimmed === '查看聚會助理 全部') {
      return { type: 'get' };
    }
    
    // Add command: 新增聚會助理 日期 招待成員1 招待成員2 祝福聖餐弟兄1 祝福聖餐弟兄2
    const addMatch = trimmed.match(/^新增聚會助理\s+(\d{4}-\d{2}-\d{2})\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/);
    if (addMatch) {
      return {
        type: 'add',
        data: {
          date: addMatch[1],
          usher1: addMatch[2],
          usher2: addMatch[3],
          sacrament1: addMatch[4],
          sacrament2: addMatch[5]
        }
      };
    }
    
    // Update command: 更新聚會助理 ID 欄位 更新內容
    const updateMatch = trimmed.match(/^更新聚會助理\s+(\d+)\s+(\S+)\s+(.+)$/);
    if (updateMatch) {
      const fieldMap: { [key: string]: string } = {
        '招待成員1': 'usher1',
        '招待成員2': 'usher2',
        '祝福聖餐弟兄1': 'sacrament1',
        '祝福聖餐弟兄2': 'sacrament2',
        '日期': 'date'
      };
      
      const field = fieldMap[updateMatch[2]];
      if (field) {
        return {
          type: 'update',
          data: {
            id: parseInt(updateMatch[1]),
            field,
            value: updateMatch[3]
          }
        };
      }
    }
    
    // Delete command: 刪除聚會助理 ID
    const deleteMatch = trimmed.match(/^刪除聚會助理\s+(\d+)$/);
    if (deleteMatch) {
      return {
        type: 'delete',
        data: {
          id: parseInt(deleteMatch[1])
        }
      };
    }
    
    return null;
  }
}
