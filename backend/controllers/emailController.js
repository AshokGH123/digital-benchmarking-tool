const EmailNotification = require('../models/EmailNotification');
const Process = require('../models/Process');
const User = require('../models/User');
const { sendBenchmarkReport } = require('../utils/emailService');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await EmailNotification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

exports.sendWeeklyReport = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const processes = await Process.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (processes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No processes found for report',
      });
    }

    const avgHealthScore = Math.round(
      processes.reduce((sum, p) => sum + p.healthScore, 0) / processes.length
    );

    const subject = `📊 Weekly Process Performance Report`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%); color: white; padding: 20px; border-radius: 10px;">
          <h1>📊 Weekly Performance Report</h1>
          <p>Hello ${user.name},</p>
          <p>Here's your weekly process performance summary</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px;">
          <h2>Summary</h2>
          <p><strong>Total Processes:</strong> ${processes.length}</p>
          <p><strong>Average Health Score:</strong> ${avgHealthScore}%</p>
          <p><strong>Good Status:</strong> ${processes.filter(p => p.status === 'Good').length}</p>
          <p><strong>Needs Attention:</strong> ${processes.filter(p => p.status === 'Poor').length}</p>
          
          <h3>Recent Processes</h3>
          ${processes.slice(0, 5).map(p => `
            <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid ${p.healthScore > 80 ? '#34C759' : p.healthScore > 60 ? '#FF9500' : '#FF3B30'};">
              <p><strong>${p.processName}</strong></p>
              <p>Health Score: ${p.healthScore}% - ${p.status}</p>
            </div>
          `).join('')}
        </div>
        
        <div style="text-align: center; color: #666; margin-top: 30px; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Digital Benchmarking Tool</p>
        </div>
      </div>
    `;

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Digital Benchmarking Tool" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject,
      html,
    });

    await EmailNotification.create({
      user: req.user.id,
      recipient: user.email,
      subject,
      content: html,
      type: 'weekly_report',
      status: 'sent',
      sentAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Weekly report sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

exports.resendNotification = async (req, res, next) => {
  try {
    const notification = await EmailNotification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Digital Benchmarking Tool" <${process.env.SMTP_USER}>`,
      to: notification.recipient,
      subject: notification.subject,
      html: notification.content,
    });

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification resent successfully',
    });
  } catch (error) {
    next(error);
  }
};
