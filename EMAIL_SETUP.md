# Email Notification System Setup

## SMTP Configuration

Add these to your `backend/.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Benchmarking Tool"
   - Copy the 16-character password
   - Use this as `SMTP_PASS` in .env

## Install nodemailer

```bash
cd backend
npm install nodemailer
```

## Features Implemented

### ✅ Automatic Email Triggers
- **Benchmark Complete**: Sent when process is created
- **Performance Alert**: Sent when health score < 60%
- **Weekly Report**: Manual trigger from UI

### ✅ Email Content
- Process summary with metrics
- Benchmark comparison
- Health score with visual indicators
- Time & cost deviation analysis
- Key insights (automated)
- Improvement suggestions
- Professional HTML template

### ✅ Notification History
- View all sent emails
- Track status (sent/failed/pending)
- Resend failed notifications
- Statistics dashboard

### ✅ Report Types
1. **Benchmark Report**: Detailed process analysis
2. **Performance Alert**: Critical issues
3. **Weekly Summary**: All processes overview

## Email Template Features

- 📊 Professional HTML design
- 🎨 Color-coded health scores
- 📈 Metrics comparison table
- 💡 Automated insights
- 🎯 Actionable suggestions
- 📱 Mobile responsive

## Testing

1. Create a process in "Process Health" page
2. Check your email for benchmark report
3. If health score < 60%, you'll get an alert
4. View history in "Notifications" page
5. Send weekly report manually

## Troubleshooting

**Email not sending?**
- Check SMTP credentials in .env
- Verify Gmail app password
- Check backend console for errors
- Ensure port 587 is not blocked

**Using other email providers:**
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Update SMTP_HOST and SMTP_PORT

## Example Email

```
Subject: Process Benchmark Report - Order Processing

Hello John Doe,

Your process analysis is complete!

Process: Order Processing
Health Score: 65% - Moderate

Performance Metrics:
- Benchmark Time: 4 hrs
- Actual Time: 6 hrs
- Time Deviation: +50%

Key Insights:
⚠️ Process time exceeds benchmark by 50%
✅ Cost efficiency improved by 5%

Improvement Suggestions:
• Reduce approval layers
• Automate manual steps
• Implement parallel processing
```

## Access Notifications

Click **Notifications** in the sidebar or notification bell → "View All Notifications"
