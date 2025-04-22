// server/middleware/auth.js
const jwt      = require('jsonwebtoken')
const UserData = require('../models/userdataModel')

module.exports = async (req, res, next) => {
  // Debug: log incoming Authorization header
  console.log('Auth header:', req.headers.authorization)

  // 1) Extract token
  let token = null
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.token) {
    token = req.cookies.token
  }

  if (!token) {
    console.error('No token provided')
    return res.status(401).json({ error: 'Authentication required' })
  }

  // 2) Verify & attach user
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserData
      .findById(payload._id)
      .select('-passwordHash')
    if (!user) throw new Error('User not found')

    req.user = user
    next()
  } catch (err) {
    console.error('Auth error:', err.message)
    res.status(401).json({ error: 'Authentication required' })
  }
}
