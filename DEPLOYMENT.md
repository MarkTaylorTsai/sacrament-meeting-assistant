# Deployment Guide

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Vercel CLI installed (`npm install -g vercel`)
- Supabase account
- LINE Developer account

### 2. Environment Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd sacrament-meeting-assistant
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

### 3. Database Setup

1. **Create Supabase project:**

   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Wait for setup to complete

2. **Run database schema:**

   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of `supabase-schema.sql`
   - Execute the SQL

3. **Get Supabase credentials:**
   - Go to Settings > API
   - Copy Project URL and anon key
   - For service role key, copy the service_role key

### 4. LINE Bot Setup

1. **Create LINE Bot:**

   - Go to [LINE Developers Console](https://developers.line.biz/)
   - Create new provider (if needed)
   - Create new Messaging API channel
   - Note down Channel Access Token and Channel Secret

2. **Configure webhook:**
   - Set webhook URL to: `https://your-app.vercel.app/webhook`
   - Enable webhook
   - Add bot to your LINE account for testing

### 5. Deploy to Vercel

1. **Deploy:**

   ```bash
   vercel
   ```

2. **Set environment variables in Vercel:**

   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all variables from your `.env` file

3. **Get your Vercel URL:**
   - Copy the production URL from Vercel dashboard
   - Update LINE webhook URL with this URL

### 6. Set up Cron Job

1. **Go to cron-job.org:**

   - Create account at [cron-job.org](https://cron-job.org/)
   - Create new cron job

2. **Configure cron job:**
   - **URL**: `https://your-app.vercel.app/reminder`
   - **Schedule**: Every Saturday at 19:00
   - **Method**: POST
   - **Headers**: `Authorization: Bearer your_cron_secret_key` (optional)

### 7. Test the Bot

1. **Add bot to LINE:**

   - Search for your bot using the LINE ID
   - Add to personal chat or group

2. **Test commands:**

   ```
   查看聚會助理 全部
   新增聚會助理 2025-11-02 王小明 李大華 陳信宏 林偉翔
   ```

3. **Test reminder:**
   - Manually trigger the reminder endpoint
   - Check Vercel function logs

## Troubleshooting

### Common Issues

1. **Bot not responding:**

   - Check LINE webhook URL is correct
   - Verify environment variables in Vercel
   - Check Vercel function logs

2. **Database connection errors:**

   - Verify Supabase URL and keys
   - Check if RLS policies are correct
   - Ensure database schema is applied

3. **Reminder not sending:**

   - Check cron job is configured correctly
   - Verify reminder endpoint is accessible
   - Check Vercel function logs for errors

4. **Command parsing issues:**
   - Ensure commands match exact format
   - Check for extra spaces or characters
   - Test with the test script: `npm run test`

### Debugging

1. **Check Vercel logs:**

   ```bash
   vercel logs
   ```

2. **Test locally:**

   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npm run test
   ```

## Security Considerations

1. **Environment Variables:**

   - Never commit `.env` file
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Database Security:**

   - Use service role key only in server-side code
   - Consider implementing user authentication
   - Review RLS policies

3. **API Security:**
   - Use HTTPS for all endpoints
   - Implement authentication for reminder endpoint
   - Validate all inputs

## Monitoring

1. **Vercel Analytics:**

   - Monitor function execution
   - Check error rates
   - Review performance metrics

2. **Supabase Dashboard:**

   - Monitor database usage
   - Check query performance
   - Review logs

3. **LINE Bot Analytics:**
   - Monitor message delivery
   - Check user engagement
   - Review error logs

## Maintenance

1. **Regular Updates:**

   - Update dependencies regularly
   - Monitor for security vulnerabilities
   - Test after updates

2. **Backup:**

   - Export database regularly
   - Keep configuration backups
   - Document any custom changes

3. **Scaling:**
   - Monitor usage patterns
   - Consider rate limiting
   - Optimize database queries
