// server/controllers/authController.js
require('dotenv').config();
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const jwt       = require('jsonwebtoken');
const UserData  = require('../models/userdataModel');
const sendEmail = require('../utils/sendEmail');

/* helper: convert csv → array, keep arrays intact */
const listify = v =>
  Array.isArray(v)
    ? v
    : typeof v === 'string'
    ? v.split(',').map(s => s.trim()).filter(Boolean)
    : [];

/* -------- REGISTRATION -------- */
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      languagesSpoken,
      otherOrganizations,
      ...profile
    } = req.body;

    // Only block if an existing account is already verified
    const existing = await UserData.findOne({ email });
    if (existing) {
      if (existing.emailVerified) {
        return res
          .status(400)
          .json({ error: 'E-mail already registered' });
      } else {
        // Remove stale unverified account so user can re-register
        await UserData.deleteOne({ _id: existing._id });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create e-mail verification token
    const rawVerify = crypto.randomBytes(32).toString('hex');
    const hashedVerify = crypto
      .createHash('sha256')
      .update(rawVerify)
      .digest('hex');
    const verifyLink = `${process.env.API_URL ||
      'http://localhost:5001'}/api/auth/verify-email/${rawVerify}`;

    // Create user record
    const user = await UserData.create({
      ...profile,
      email,
      passwordHash,
      languagesSpoken:    listify(languagesSpoken),
      otherOrganizations: listify(otherOrganizations),
      verifyEmailToken:   hashedVerify,
      verifyEmailExpires: Date.now() + 24 * 3600_000, // 24h
      emailVerified:      false
    });

    // Send verification e-mail
    await sendEmail({
      to: email,
      subject: 'Confirm your e-mail',
      html: `Please click <a href="${verifyLink}">here</a> to verify your e-mail.`
    });

    return res
      .status(201)
      .json({ message: 'Account created. Check your e-mail to confirm.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/* -------- VERIFY EMAIL -------- */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserData.findOne({
      verifyEmailToken:   hashed,
      verifyEmailExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: 'Link invalid or expired' });
    }

    user.emailVerified     = true;
    user.verifyEmailToken  = undefined;
    user.verifyEmailExpires= undefined;
    await user.save();

    res.json({ message: 'E-mail verified — you can now log in.' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* -------- LOGIN -------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserData.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.emailVerified)
      return res
        .status(400)
        .json({ error: 'Please verify your e-mail first' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* -------- FORGOT PASSWORD -------- */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserData.findOne({ email });
    if (!user)
      return res.json({
        message: 'If the address exists, a link was sent.'
      });

    const raw = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    user.resetPasswordToken   = hashed;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    const link = `${process.env.API_URL ||
      'http://localhost:5001'}/api/auth/reset-password/${raw}`;
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${link}">here</a> to reset your password.`
    });

    res.json({ message: 'If the address exists, a link was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* -------- RESET PASSWORD -------- */
exports.resetPassword = async (req, res) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserData.findOne({
      resetPasswordToken:   hashed,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user)
      return res
        .status(400)
        .json({ error: 'Token is invalid or has expired' });

    user.passwordHash         = await bcrypt.hash(password, 10);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated — you can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
