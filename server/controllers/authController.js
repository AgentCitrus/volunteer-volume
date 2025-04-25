// server/controllers/authController.js
require('dotenv').config();
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const jwt     = require('jsonwebtoken');
const UserData = require('../models/userdataModel');
const sendEmail = require('../utils/sendEmail');

/* ───────────────────────────────── REGISTER ───────────────────────────────── */
exports.register = async (req, res) => {
  try {
    /* pull out auth fields; keep everything else in “profile” */
    const { email, password, languagesSpoken, otherOrganizations, ...profile } =
      req.body;

    if (await UserData.findOne({ email }))
      return res.status(400).json({ error: 'E-mail already registered' });

    /* hash the password */
    const passwordHash = await bcrypt.hash(password, 10);

    /* normalise optional list fields (string → array) */
    const listify = value =>
      Array.isArray(value)
        ? value
        : typeof value === 'string' && value.trim() !== ''
        ? value.split(',').map(s => s.trim()).filter(Boolean)
        : [];

    const user = await UserData.create({
      ...profile,
      email,
      passwordHash,
      languagesSpoken:   listify(languagesSpoken),
      otherOrganizations:listify(otherOrganizations)
    });

    /* sign token with role so the UI can know if the user is admin */
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)
        .map(e => `${e.path}: ${e.message}`)
        .join(', ');
      return res.status(400).json({ error: `Validation failed: ${msg}` });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ───────────────────────────────── LOGIN ───────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ────────────────────────────── FORGOT-PASSWORD ───────────────────────────── */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserData.findOne({ email });

    /* Always respond 200 to avoid revealing which emails exist */
    if (!user) {
      return res.json({
        message:
          'If that address is registered, a reset link has been sent to it.'
      });
    }

    /* generate secure token */
    const rawToken    = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken   = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 h
    await user.save({ validateBeforeSave: false });

    const resetURL = `${
      process.env.FRONTEND_URL || 'http://localhost:3000'
    }/reset-password/${rawToken}`;

    const html = `
      <p>Hello ${user.firstName || ''},</p>
      <p>You requested a password reset for your VolunteerVolume account.</p>
      <p><a href="${resetURL}">Click here to choose a new password</a>.
         This link expires in one hour.</p>
      <p>If you didn’t ask for this, please ignore this e-mail.</p>
    `;
    await sendEmail(user.email, 'VolunteerVolume – Reset your password', html);

    res.json({
      message:
        'If that address is registered, a reset link has been sent to it.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ─────────────────────────────── RESET-PASSWORD ───────────────────────────── */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserData.findOne({
      resetPasswordToken:   hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ error: 'Token is invalid or has expired' });

    user.passwordHash        = await bcrypt.hash(password, 10);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated – you can now log in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
