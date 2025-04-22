// server/controllers/authController.js
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const UserData = require('../models/userdataModel');

/* ----------  POST /api/auth/register  ---------- */
exports.register = async (req, res) => {
  try {
    const {
      firstName, lastName, birthday,
      street, city, state,
      phoneNumber, preferredContact,
      languagesSpoken, howHeard,
      otherOrganizations, disabilities,
      emergencyContact,                 // { name, phone, relationship }
      email, password
    } = req.body;

    if (await UserData.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await UserData.create({
      firstName, lastName, birthday,
      street, city, state,
      phoneNumber, preferredContact,
      languagesSpoken, howHeard,
      otherOrganizations, disabilities,
      emergencyContact,
      email,
      passwordHash
    });

    res.status(201).json({ message: 'Account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ----------  POST /api/auth/login  ---------- */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserData.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)  return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    /* send BOTH cookie + token so the SPA can store it */
    res
      .cookie('token', token, {
        httpOnly : true,
        secure   : false,          // set true behind HTTPS
        sameSite : 'none',         // allow cross‑port in dev
        maxAge   : 8 * 3600_000
      })
      .json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
