const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User   = require('../models/userModel')

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Check if user exists
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    // 2. Hash password
    const salt         = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // 3. Create user
    const user = await User.create({ name, email, passwordHash })

    // 4. Respond (omit hash)
    res.status(201).json({ id: user._id, name: user.name, email: user.email })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // 3. Sign JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    // 4. Set HttpOnly cookie and return user info
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 3600 * 1000  // 8 hours
      })
      .status(200)
      .json({
        user: { id: user._id, name: user.name, role: user.role }
      })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
