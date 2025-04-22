// server/middleware/auth.js
const jwt      = require('jsonwebtoken');
const UserData = require('../models/userdataModel');

module.exports = async (req, res, next) => {
  let token = null;

  /* 1.  Read token from header first … */
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  /* 2. … or fallback to cookie set at login */
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserData.findById(payload._id).select('-passwordHash');
    if (!user) throw new Error('User not found');

    req.user = user;                 // ← available in every controller
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication required' });
  }
};
