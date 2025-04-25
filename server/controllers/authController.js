require('dotenv').config()
const bcrypt     = require('bcryptjs')
const jwt        = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const UserData   = require('../models/userdataModel')

/* POST /api/auth/register */
exports.register = async (req, res) => {
  try {
    // ... your existing registration logic ...
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
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

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await transporter.sendMail({
      from:    process.env.SMTP_FROM,
      to:      email,
      subject: '🔐 Reset Your Password',
      html: `
        <p>Hi ${user.firstName || ''},</p>
        <p>You requested a password reset. Click below:</p>
        <p><a href="${resetUrl}">Reset Your Password</a></p>
        <p>This link expires in one hour.</p>
        <p>If you didn’t request this, ignore this email.</p>
      `
    })

    res.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/* POST /api/auth/reset-password/:token */
exports.resetPassword = async (req, res) => {
  const { token }    = req.params
  const { password } = req.body

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await UserData.findById(payload.id)
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
    res.status(400).json({ error: 'Invalid reset link.' })
  }
}
