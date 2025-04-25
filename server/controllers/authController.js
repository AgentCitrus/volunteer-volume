// server/controllers/authController.js
require('dotenv').config()
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const UserData   = require('../models/userdataModel')

/* ─────────── POST /api/auth/register ─────────── */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body
    if (await UserData.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await UserData.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || 'volunteer'
    })
    res.status(201).json({ message: 'Registered successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

/* ─────────── POST /api/auth/login ─────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserData.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    // ←– Use _id here so your auth middleware can find payload._id
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )
    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ────────── POST /api/auth/forgot-password ────────── */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await UserData.findOne({ email })
    // always respond with success to prevent enumeration
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' })
    }

    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
    await transporter.sendMail({
      from:    process.env.SMTP_FROM,
      to:      user.email,
      subject: 'VolunteerVolume Password Reset',
      text:    `Reset your password here:\n\n${resetUrl}`
    })
    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ────────── POST /api/auth/reset-password/:token ────────── */
exports.resetPassword = async (req, res) => {
  try {
    const { token }    = req.params
    const { password } = req.body
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserData.findById(payload._id)
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' })
    }

    user.passwordHash = await bcrypt.hash(password, 10)
    await user.save()
    res.json({ message: 'Password has been reset successfully.' })
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset link has expired.' })
    }
    res.status(400).json({ error: 'Invalid or expired token.' })
  }
}
