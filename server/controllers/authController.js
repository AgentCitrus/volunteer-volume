// server/controllers/authController.js
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const UserData = require('../models/userdataModel')

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const {
      firstName, lastName, birthday,
      street, city, state,
      phoneNumber, preferredContact,
      languagesSpoken, howHeard,
      otherOrganizations, disabilities,
      emergencyContact,
      email, password
    } = req.body

    // 1. Email unique?
    if (await UserData.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    // 2. Hash password
    const salt         = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // 3. Create user with full profile + auth
    const user = await UserData.create({
      firstName, lastName, birthday,
      street, city, state,
      phoneNumber, preferredContact,
      languagesSpoken, howHeard,
      otherOrganizations, disabilities,
      emergencyContact,
      email, passwordHash
    })

    // 4. Return basic info
    res.status(201).json({
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserData.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res
      .cookie('token', token, {
        httpOnly: true,
        secure:   false,    // change to true in prod
        sameSite: 'none',   // allows cross‑port in dev
        maxAge:   8*3600*1000
      })
      .status(200)
      .json({ user: { id:user._id, firstName:user.firstName, lastName:user.lastName, email:user.email, role:user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
