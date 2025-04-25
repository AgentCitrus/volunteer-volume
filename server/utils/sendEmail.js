// server/utils/sendEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Sends an e-mail.
 * @param {string} to      – destination address
 * @param {string} subject – subject line
 * @param {string} html    – HTML body
 */
module.exports = async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,        // e.g. “smtp.gmail.com”
    port:   process.env.SMTP_PORT,        // 587 for TLS
    secure: process.env.SMTP_SECURE === 'true', // “false” for port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM, // e.g. “VolunteerVolume Support <support@…>”
    to,
    subject,
    html
  });
};
