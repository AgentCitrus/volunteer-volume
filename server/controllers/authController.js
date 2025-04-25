// server/controllers/authController.js
require('dotenv').config()
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const UserData   = require('../models/userdataModel')

/* POST /api/auth/register */
exports.register = async (req, res) => {
  try {
    // … your existing registration logic
    res.status(201).json({ message: 'Registered successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

/* POST /api/auth/login */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserData.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    // ← Changed here: sign with _id so auth-middleware can read payload._id
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res
      .cookie('token', token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge:   8 * 3600_000
      })
      .json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/* POST /api/auth/forgot-password */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await UserData.findOne({ email })
    // always respond 200
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' })
    }
    // … your existing reset-token & nodemailer logic
    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/* POST /api/auth/reset-password/:token */
exports.resetPassword = async (req, res) => {
  // … unchanged
}
