const nodemailer = require('nodemailer');
const EmailNotification = require('../models/EmailNotification');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateBenchmarkReport = (process, user) => {
  const timeDeviation = ((process.actualTime - process.benchmarkTime) / process.benchmarkTime * 100).toFixed(1);
  const costDeviation = ((process.actualCost - process.benchmarkCost) / process.benchmarkCost * 100).toFixed(1);
  
  const insights = [];
  if (process.actualTime > process.benchmarkTime) {
    insights.push(`⚠️ Process time exceeds benchmark by ${Math.abs(timeDeviation)}%`);
  } else {
    insights.push(`✅ Process time is ${Math.abs(timeDeviation)}% better than benchmark`);
  }
  
  if (process.actualCost > process.benchmarkCost) {
    insights.push(`⚠️ Cost exceeds benchmark by ${Math.abs(costDeviation)}%`);
  } else {
    insights.push(`✅ Cost efficiency improved by ${Math.abs(costDeviation)}%`);
  }
  
  if (process.errorRate > 5) {
    insights.push(`⚠️ Error rate is ${process.errorRate}% - Quality improvement needed`);
  }

  const suggestions = [];
  if (process.actualTime > process.benchmarkTime) {
    suggestions.push('• Reduce approval layers');
    suggestions.push('• Automate manual steps');
    suggestions.push('• Implement parallel processing');
  }
  if (process.actualCost > process.benchmarkCost) {
    suggestions.push('• Optimize resource allocation');
    suggestions.push('• Review vendor contracts');
    suggestions.push('• Reduce overtime costs');
  }
  if (process.errorRate > 5) {
    suggestions.push('• Implement quality checks');
    suggestions.push('• Provide additional training');
    suggestions.push('• Use automated validation');
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%); color: white; padding: 20px; border-radius: 10px; }
    .content { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .metric { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
    .score { font-size: 48px; font-weight: bold; color: ${process.healthScore > 80 ? '#34C759' : process.healthScore > 60 ? '#FF9500' : '#FF3B30'}; text-align: center; margin: 20px 0; }
    .insight { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #007AFF; border-radius: 5px; }
    .suggestion { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #34C759; border-radius: 5px; }
    .footer { text-align: center; color: #666; margin-top: 30px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Process Benchmark Report</h1>
      <p>Hello ${user.name},</p>
      <p>Your process analysis is complete!</p>
    </div>

    <div class="content">
      <h2>Process: ${process.processName}</h2>
      
      <div class="score">${process.healthScore}%</div>
      <p style="text-align: center; font-weight: bold;">Health Score - ${process.status}</p>

      <h3>📈 Performance Metrics</h3>
      <div class="metric">
        <span><strong>Benchmark Time:</strong></span>
        <span>${process.benchmarkTime} hrs</span>
      </div>
      <div class="metric">
        <span><strong>Actual Time:</strong></span>
        <span>${process.actualTime} hrs</span>
      </div>
      <div class="metric">
        <span><strong>Time Deviation:</strong></span>
        <span style="color: ${timeDeviation > 0 ? '#FF3B30' : '#34C759'}">${timeDeviation > 0 ? '+' : ''}${timeDeviation}%</span>
      </div>
      
      <div class="metric">
        <span><strong>Benchmark Cost:</strong></span>
        <span>$${process.benchmarkCost}</span>
      </div>
      <div class="metric">
        <span><strong>Actual Cost:</strong></span>
        <span>$${process.actualCost}</span>
      </div>
      <div class="metric">
        <span><strong>Cost Deviation:</strong></span>
        <span style="color: ${costDeviation > 0 ? '#FF3B30' : '#34C759'}">${costDeviation > 0 ? '+' : ''}${costDeviation}%</span>
      </div>
      
      <div class="metric">
        <span><strong>Error Rate:</strong></span>
        <span>${process.errorRate}%</span>
      </div>

      <h3>💡 Key Insights</h3>
      ${insights.map(insight => `<div class="insight">${insight}</div>`).join('')}

      ${suggestions.length > 0 ? `
        <h3>🎯 Improvement Suggestions</h3>
        ${suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join('')}
      ` : ''}
    </div>

    <div class="footer">
      <p>This is an automated report from Digital Benchmarking Tool</p>
      <p>© ${new Date().getFullYear()} Digital Benchmarking Tool. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

const sendEmail = async (to, subject, html, type, userId) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, skipping email');
    await EmailNotification.create({
      user: userId,
      recipient: to,
      subject,
      content: html,
      type,
      status: 'pending',
    });
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Digital Benchmarking Tool" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    await EmailNotification.create({
      user: userId,
      recipient: to,
      subject,
      content: html,
      type,
      status: 'sent',
      sentAt: new Date(),
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    await EmailNotification.create({
      user: userId,
      recipient: to,
      subject,
      content: html,
      type,
      status: 'failed',
    });

    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

const sendBenchmarkReport = async (process, user) => {
  const subject = `Process Benchmark Report - ${process.processName}`;
  const html = generateBenchmarkReport(process, user);
  return await sendEmail(user.email, subject, html, 'benchmark_complete', user._id);
};

const sendPerformanceAlert = async (process, user) => {
  const subject = `⚠️ Performance Alert - ${process.processName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #FF3B30; color: white; padding: 20px; border-radius: 10px;">
        <h1>⚠️ Performance Alert</h1>
        <p>Hello ${user.name},</p>
        <p>Process "${process.processName}" requires immediate attention!</p>
      </div>
      <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px;">
        <h2>Health Score: ${process.healthScore}%</h2>
        <p><strong>Status:</strong> ${process.status}</p>
        <h3>Active Alerts:</h3>
        ${process.alerts.map(alert => `<p>• ${alert.message}</p>`).join('')}
        <p style="margin-top: 20px;"><strong>Action Required:</strong> Please review and optimize this process immediately.</p>
      </div>
    </div>
  `;
  return await sendEmail(user.email, subject, html, 'performance_alert', user._id);
};

module.exports = {
  sendEmail,
  sendBenchmarkReport,
  sendPerformanceAlert,
  generateBenchmarkReport,
};
