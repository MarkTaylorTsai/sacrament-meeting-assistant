# Usage Examples

## Basic Commands

### 1. View All Assignments

Send this message to the bot:

```
查看聚會助理 全部
```

**Response:**

```
ID: 1
日期: 2025/11/02
招待: 王小明、李大華
祝福聖餐: 陳信宏、林偉翔

ID: 2
日期: 2025/11/09
招待: 張志明、林美華
祝福聖餐: 陳建國、黃淑芬
```

### 2. Add New Assignment

```
新增聚會助理 2025-11-02 王小明 李大華 陳信宏 林偉翔
```

**Response:**

```
已成功新增聚會助理安排:
ID: 1
日期: 2025/11/02
招待: 王小明、李大華
祝福聖餐: 陳信宏、林偉翔
```

### 3. Update Assignment

```
更新聚會助理 1 招待成員1 陳志強
```

**Response:**

```
已成功更新聚會助理安排:
ID: 1
日期: 2025/11/02
招待: 陳志強、李大華
祝福聖餐: 陳信宏、林偉翔
```

### 4. Delete Assignment

```
刪除聚會助理 1
```

**Response:**

```
已成功刪除ID為 1 的聚會助理安排
```

## Field Names for Updates

When updating assignments, use these exact field names:

- `招待成員1` - First usher
- `招待成員2` - Second usher
- `祝福聖餐弟兄1` - First sacrament brother
- `祝福聖餐弟兄2` - Second sacrament brother
- `日期` - Date (format: YYYY-MM-DD)

## Reminder Messages

Every Saturday at 7:00 PM, the bot automatically sends reminders like this:

```
明日聖餐聚會 (11/2)
招待:
• 王小明
• 李大華
祝福聖餐:
• 陳信宏
• 林偉翔
```

## Common Scenarios

### Setting Up Weekly Assignments

1. **Add assignments for the month:**

   ```
   新增聚會助理 2025-11-02 王小明 李大華 陳信宏 林偉翔
   新增聚會助理 2025-11-09 張志明 林美華 陳建國 黃淑芬
   新增聚會助理 2025-11-16 李志強 王美玲 林建華 陳淑芬
   新增聚會助理 2025-11-23 陳志明 張美華 王建國 林淑芬
   ```

2. **Check all assignments:**
   ```
   查看聚會助理 全部
   ```

### Making Changes

1. **Someone can't make it - replace them:**

   ```
   更新聚會助理 1 招待成員1 陳志強
   ```

2. **Date change:**

   ```
   更新聚會助理 1 日期 2025-11-03
   ```

3. **Cancel an assignment:**
   ```
   刪除聚會助理 1
   ```

## Error Messages

### Invalid Command Format

```
請使用正確的命令格式。輸入「查看聚會助理 全部」查看所有命令。
```

### Database Errors

```
處理命令時發生錯誤: Failed to add meeting assistant: duplicate key value violates unique constraint
```

### No Data Found

```
目前沒有聚會助理安排
```

## Tips for Best Usage

1. **Plan ahead:** Add assignments for the entire month
2. **Use consistent names:** Use the same name format for each person
3. **Check regularly:** Use "查看聚會助理 全部" to review assignments
4. **Update promptly:** Make changes as soon as you know about them
5. **Test the bot:** Add a test assignment to verify everything works

## Troubleshooting

### Bot Not Responding

- Check if the bot is added to your chat
- Verify the command format is exactly correct
- Check for extra spaces or characters

### Wrong Date Format

- Use YYYY-MM-DD format (e.g., 2025-11-02)
- Don't use slashes or other separators

### Name Issues

- Use consistent names (avoid nicknames)
- Keep names simple (avoid special characters)
- Use full names for clarity

### Update Not Working

- Check the field name is exactly correct
- Verify the ID exists (use "查看聚會助理 全部" first)
- Ensure the new value doesn't contain special characters
