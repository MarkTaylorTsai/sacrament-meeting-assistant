# Troubleshooting Guide

## 404 Not Found Error

If you're getting a 404 error when LINE tries to reach your webhook, here are the steps to fix it:

### 1. Check Your Deployment URL

Make sure you're using the correct Vercel URL:

```bash
# After deploying with Vercel, you'll get a URL like:
https://your-app-name.vercel.app
```

### 2. Test Your Endpoints

Test these URLs in your browser:

- **Test endpoint**: `https://your-app-name.vercel.app/test`
- **Webhook endpoint**: `https://your-app-name.vercel.app/webhook`

Both should return JSON responses, not 404 errors.

### 3. Check Vercel Deployment

```bash
# Check if your deployment is successful
vercel ls

# Check logs for errors
vercel logs
```

### 4. Verify Environment Variables

Make sure all required environment variables are set in Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `LINE_CHANNEL_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 5. Check LINE Webhook Configuration

In LINE Developer Console:

1. Go to your Messaging API channel
2. Go to "Messaging API" tab
3. Set webhook URL to: `https://your-app-name.vercel.app/webhook`
4. Click "Verify" to test the webhook
5. Enable "Use webhook"

### 6. Common Issues

#### Issue: "Webhook endpoint is working" but bot doesn't respond

**Solution**: Check environment variables are set correctly in Vercel.

#### Issue: 404 error persists

**Solution**: 
1. Redeploy your app: `vercel --prod`
2. Wait 2-3 minutes for deployment to complete
3. Test the webhook URL again

#### Issue: Bot responds but commands don't work

**Solution**: Check Supabase connection and database schema.

### 7. Debug Steps

1. **Test the webhook manually:**
   ```bash
   curl -X POST https://your-app-name.vercel.app/webhook \
     -H "Content-Type: application/json" \
     -d '{"events":[{"type":"message","message":{"type":"text","text":"test"},"replyToken":"test"}]}'
   ```

2. **Check Vercel function logs:**
   ```bash
   vercel logs --follow
   ```

3. **Test individual components:**
   - Test endpoint: `https://your-app-name.vercel.app/test`
   - Webhook endpoint: `https://your-app-name.vercel.app/webhook`

### 8. Environment Variables Checklist

Make sure these are set in Vercel:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_token_here
LINE_CHANNEL_SECRET=your_secret_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 9. LINE Webhook URL Format

The webhook URL should be:
```
https://your-app-name.vercel.app/webhook
```

**NOT:**
- `https://your-app-name.vercel.app/api/webhook` ❌
- `https://your-app-name.vercel.app/webhook/` ❌ (trailing slash)

### 10. Quick Fix Commands

```bash
# Redeploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Test locally (optional)
npm run dev
```

## Still Having Issues?

1. **Check Vercel Dashboard** for any deployment errors
2. **Check LINE Developer Console** for webhook verification status
3. **Test the webhook URL** in your browser - it should return a JSON response
4. **Verify environment variables** are set correctly in Vercel
5. **Wait 2-3 minutes** after deployment before testing

The most common cause of 404 errors is using the wrong URL format or the deployment not being complete.
