// server/controllers/userdataController.js
require('dotenv').config();
const crypto   = require('crypto');
const UserData = require('../models/userdataModel');
const sendEmail = require('../utils/sendEmail');

/* ───────────────────────── HELPERS ───────────────────────── */
const makeVerifyToken = () => {
  const raw   = crypto.randomBytes(32).toString('hex');
  const hash  = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
};

/* ───────────────── GET (current or all) ──────────────────── */
exports.getAllUserData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { _id: req.user._id };
    const users  = await UserData.find(filter).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────────── GET by id ─────────────────────────────── */
exports.getUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────────── ADD (admin seed) ──────────────────────── */
exports.addUserData = async (req, res) => {
  try {
    const user = await UserData.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ───────────────── UPDATE profile (PATCH) ─────────────────── */
exports.updateUserData = async (req, res) => {
  try {
    /* avoid duplicate e-mails / phone numbers */
    if (req.body.email) {
      const exists = await UserData.findOne({
        email: req.body.email,
        _id:   { $ne: req.params.id }
      });
      if (exists)
        return res
          .status(400)
          .json({ error: 'Validation failed: email: Email already in use.' });
    }
    if (req.body.phoneNumber) {
      const exists = await UserData.findOne({
        phoneNumber: req.body.phoneNumber,
        _id:         { $ne: req.params.id }
      });
      if (exists)
        return res
          .status(400)
          .json({
            error:
              'Validation failed: phoneNumber: Phone number already in use.'
          });
    }

    /* ── check if e-mail is changing ── */
    const prev = await UserData.findById(req.params.id);
    if (!prev) return res.status(404).json({ error: 'Not found' });

    let emailChanged = false;
    if (req.body.email && req.body.email !== prev.email) {
      emailChanged = true;
      const { raw, hash } = makeVerifyToken();

      req.body.emailVerified    = false;
      req.body.verifyEmailToken = hash;
      req.body.verifyEmailExpires = Date.now() + 24 * 3600_000; // 24 h

      /* send confirmation mail */
      const verifyURL = `${
        process.env.FRONTEND_URL || 'http://localhost:3000'
      }/verify-email/${raw}`;
      const html = `
        <p>Hello ${prev.firstName || ''},</p>
        <p>We noticed you updated the e-mail on your VolunteerVolume profile.</p>
        <p><a href="${verifyURL}">Click here to confirm your new e-mail address</a>.</p>
        <p>This link expires in 24&nbsp;hours.</p>
      `;
      /* don’t block the response if sending fails */
      sendEmail(req.body.email, 'Confirm your new e-mail address', html).catch(
        console.error
      );
    }

    /* actually update the doc */
    const user = await UserData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      select: '-passwordHash'
    });

    const msg = emailChanged
      ? 'Profile updated – please confirm your new e-mail.'
      : 'Profile updated';

    res.json({ user, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/* ───────────────── DELETE ────────────────────────────────── */
exports.deleteUserData = async (req, res) => {
  try {
    const user = await UserData.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
