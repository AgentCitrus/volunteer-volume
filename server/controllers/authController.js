// server/controllers/authController.js
require('dotenv').config();
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const jwt     = require('jsonwebtoken');
const UserData = require('../models/userdataModel');
const sendEmail = require('../utils/sendEmail');

/* helper: convert csv → array, keep arrays intact */
const listify = v =>
  Array.isArray(v)
    ? v
    : typeof v === 'string'
    ? v.split(',').map(s => s.trim()).filter(Boolean)
    : [];

/* ───────────────────────── REGISTER ───────────────────────── */
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      languagesSpoken,
      otherOrganizations,
      ...profile
    } = req.body;

    if (await UserData.findOne({ email }))
      return res.status(400).json({ error: 'E-mail already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    /* create verify-email token */
    const rawVerify = crypto.randomBytes(32).toString('hex');
    const hashedVerify = crypto
      .createHash('sha256')
      .update(rawVerify)
      .digest('hex');
      const verifyLink = `${process.env.API_URL || 'http://localhost:5001'}/api/auth/verify-email/${rawVerify}`;

    /* save user */
    const user = await UserData.create({
      ...profile,
      email,
      passwordHash,
      languagesSpoken:   listify(languagesSpoken),
      otherOrganizations:listify(otherOrganizations),
      verifyEmailToken:   hashedVerify,
      verifyEmailExpires: Date.now() + 24 * 3600_000, // 24 h
      emailVerified: false
    });

    /* send confirmation e-mail */
    const html = `
      <p>Hello ${user.firstName || ''},</p>
      <p>Thanks for creating a VolunteerVolume account!</p>
      <p><a href="${verifyLink}">Click here to confirm your e-mail address.</a></p>
      <p>This link expires in 24&nbsp;hours.</p>
    `;
    await sendEmail(
      email,
      'Confirm your VolunteerVolume account',
      html
    );

    res
      .status(201)
      .json({ message: 'Account created — check your e-mail to confirm.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ─────────────────────── VERIFY-EMAIL ─────────────────────── */
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserData.findOne({
      verifyEmailToken: hashed,
      verifyEmailExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).send('Link invalid or expired.');

    user.emailVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpires = undefined;
    await user.save();

    /* (optional) auto-log-in */
    const jwtToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token: jwtToken, message: 'E-mail verified — welcome!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error.');
  }
};

/* ────────────────────────── LOGIN ─────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.emailVerified)
      return res.status(403).json({ error: 'Please confirm your e-mail first' });

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

/* ──────────────────── FORGOT-PASSWORD ─────────────────────── */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserData.findOne({ email });

    /* always respond 200 */
    if (!user) {
      return res.json({
        message:
          'If that address is registered, a reset link has been sent to it.'
      });
    }

    /* generate reset token */
    const rawReset = crypto.randomBytes(32).toString('hex');
    const hashedReset = crypto.createHash('sha256').update(rawReset).digest('hex');

    user.resetPasswordToken   = hashedReset;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 h
    await user.save({ validateBeforeSave: false });

    const resetURL = `${
      process.env.FRONTEND_URL || 'http://localhost:3000'
    }/reset-password/${rawReset}`;

    const html = `
      <p>Hello ${user.firstName || ''},</p>
      <p>You requested a password reset for your VolunteerVolume account.</p>
      <p><a href="${resetURL}">Click here to choose a new password</a> (valid 1 hour).</p>
      <p>If you didn’t ask for this, you can ignore this email.</p>
    `;
    await sendEmail(email, 'VolunteerVolume – Reset your password', html);

    res.json({
      message:
        'If that address is registered, a reset link has been sent to it.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ─────────────────────── RESET-PASSWORD ───────────────────── */
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserData.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user)
      return res.status(400).json({ error: 'Token is invalid or has expired' });

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated – you can now log in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
