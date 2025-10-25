# Webhook Troubleshooting Guide

## Common 404 Errors and Solutions

### 1. **404 Not Found Error**

**Problem:** LINE webhook returns 404 Not Found

**Solutions:**

#### A. Check Your Webhook URL

Make sure you're using the correct URL format:

```
✅ Correct: https://your-app-name.vercel.app/webhook
❌ Wrong: https://your-app-name.vercel.app/api/webhook
```

#### B. Verify Vercel Deployment

1. Check if your app is deployed:

   ```bash
   vercel ls
   ```

2. Test the webhook endpoint directly:

   ```bash
   curl https://your-app-name.vercel.app/webhook
   ```

3. Check Vercel function logs:
   ```bash
   vercel logs
   ```

#### C. Test Endpoints

Use these URLs to test your deployment:

- **Test endpoint:** `https://your-app-name.vercel.app/test`
- **Webhook endpoint:** `https://your-app-name.vercel.app/webhook`
- **Reminder endpoint:** `https://your-app-name.vercel.app/reminder`

### 2. **Environment Variables Missing**

**Problem:** Bot can't connect to LINE or Supabase

**Solution:**

1. Check Vercel environment variables:

   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure all required variables are set:
     - `LINE_CHANNEL_ACCESS_TOKEN`
     - `LINE_CHANNEL_SECRET`
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`

2. Redeploy after setting variables:
   ```bash
   vercel --prod
   ```

### 3. **LINE Webhook Verification**

**Problem:** LINE can't verify your webhook

**Solution:**

1. Make sure your webhook URL is accessible
2. Test with a simple GET request:

   ```bash
   curl -X GET https://your-app-name.vercel.app/webhook
   ```

   Should return: `{"message":"Webhook is working"}`

3. Check LINE Developer Console:
   - Go to your LINE Bot channel
   - Navigate to "Messaging API" tab
   - Click "Verify" next to your webhook URL

### 4. **Database Connection Issues**

**Problem:** Commands fail with database errors

**Solution:**

1. Verify Supabase credentials
2. Check if database schema is applied
3. Test database connection:
   ```bash
   # Test the reminder endpoint
   curl -X POST https://your-app-name.vercel.app/reminder
   ```

### 5. **Command Not Working**

**Problem:** Bot doesn't respond to commands

**Debug Steps:**

1. Check Vercel function logs:

   ```bash
   vercel logs --follow
   ```

2. Test command parsing locally:

   ```bash
   npm run test
   ```

3. Verify command format exactly:
   ```
   ✅ 查看聚會助理 全部
   ❌ 查看聚會助理全部
   ❌ 查看 聚會助理 全部
   ```

## Quick Fixes

### 1. **Redeploy Everything**

```bash
# Clean build and redeploy
rm -rf .vercel
vercel --prod
```

### 2. **Check Function Logs**

```bash
# Follow logs in real-time
vercel logs --follow

# Check specific function
vercel logs --function=webhook
```

### 3. **Test Webhook Manually**

```bash
# Test webhook endpoint
curl -X POST https://your-app-name.vercel.app/webhook \
  -H "Content-Type: application/json" \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"查看聚會助理 全部"},"replyToken":"test"}]}'
```

### 4. **Verify LINE Bot Setup**

1. Go to LINE Developer Console
2. Check your bot's status
3. Verify webhook URL is set correctly
4. Test with LINE Bot

## Common Error Messages

### **"Webhook returned HTTP status code other than 200"**

- Check if your Vercel app is deployed
- Verify the webhook URL is correct
- Check Vercel function logs for errors

### **"Failed to fetch meeting assistants"**

- Check Supabase credentials
- Verify database schema is applied
- Check if RLS policies are correct

### **"Command handling error"**

- Check command format
- Verify environment variables
- Check Vercel function logs

## Testing Checklist

### ✅ **Before Setting LINE Webhook:**

1. [ ] App is deployed to Vercel
2. [ ] Test endpoint works: `https://your-app.vercel.app/test`
3. [ ] Webhook endpoint responds: `https://your-app.vercel.app/webhook`
4. [ ] Environment variables are set in Vercel
5. [ ] No errors in Vercel function logs

### ✅ **After Setting LINE Webhook:**

1. [ ] LINE webhook verification passes
2. [ ] Bot responds to test messages
3. [ ] Commands work correctly
4. [ ] Database operations succeed

## Still Having Issues?

1. **Check Vercel Status:** Visit [vercel-status.com](https://vercel-status.com)
2. **Check LINE Status:** Visit [LINE Developer Status](https://status.line.biz/)
3. **Review Logs:** Always check `vercel logs` for detailed error messages
4. **Test Locally:** Use `npm run test` to verify functionality

## Emergency Fixes

### **Quick Redeploy:**

```bash
vercel --prod --force
```

### **Reset Environment:**

1. Delete all environment variables in Vercel
2. Re-add them one by one
3. Redeploy

### **Check Dependencies:**

```bash
npm install
npm run build
vercel --prod
```
