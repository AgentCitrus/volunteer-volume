// server/controllers/authController.js
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const UserData = require('../models/userdataModel')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserData.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    // 1) Sign JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    // 2) Set HttpOnly cookie (optional but nice for SSR)
    res.cookie('token', token, {
      httpOnly: true,
      secure:   false,      // set true in prod (requires https)
      sameSite: 'none',     // allow cross‑origin cookie in dev
      maxAge:   8 * 3600 * 1000
    })

    // 3) ALSO return token in JSON  ← you **must** send this
    res.status(200).json({
      token,
      user: {
        id:        user._id,
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        role:      user.role
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
