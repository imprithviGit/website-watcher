const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendAlertEmail(text) {
  await transporter.sendMail({
    from: `"Website Watcher" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: '📅 Appointment Availability Alert',
    text
  });
}

module.exports = sendAlertEmail;
