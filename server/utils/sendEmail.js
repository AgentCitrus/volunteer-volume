// server/utils/sendEmail.js
require('dotenv').config();
const nodemailer = require('nodemailer');

/**
 * Sends an e-mail.
 * @param {Object}   opts
 * @param {string}   opts.to      – destination address
 * @param {string}   opts.subject – subject line
 * @param {string}   opts.html    – HTML body
 */
module.exports = async function sendEmail({ to, subject, html }) {
  // create a reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,           // e.g. "smtp.gmail.com"
    port:   Number(process.env.SMTP_PORT),   // 587 for TLS
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,           // SMTP login user
      pass: process.env.SMTP_PASS            // SMTP login password
    }
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from:    process.env.SMTP_FROM, // e.g. "VolunteerVolume Support <support@…>"
    to,
    subject,
    html
  });
};
