// server/middleware/auth.js
const jwt  = require('jsonwebtoken')
const User = require('../models/userModel')

module.exports = async (req, res, next) => {
  try {
    // 1. Pull token from header or cookie
    let token = null
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.token) {
      token = req.cookies.token
    }
    if (!token) throw new Error('No token')

    // 2. Verify & decode
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // 3. Attach user to req
    const user = await User.findById(payload._id).select('-passwordHash')
    if (!user) throw new Error('User not found')
    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ error: 'Authentication required' })
  }
}
