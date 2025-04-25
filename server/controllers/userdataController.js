const bcrypt   = require('bcryptjs');
const UserData = require('../models/userdataModel');

/* ───────────  GET /api/userdata  ─────────── */
exports.getAllUserData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { _id: req.user._id };
    const users = await UserData.find(filter).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────  GET /api/userdata/:id  ─────────── */
exports.getUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id)
      .select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' &&
        user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────  POST /api/userdata  ─────────── */
exports.addUserData = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (await UserData.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserData.create({
      firstName, lastName, email, passwordHash, role
    });
    res.status(201).json({
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ───────────  PATCH /api/userdata/:id  ─────────── */
exports.updateUserData = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await UserData.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (req.user.role !== 'admin' &&
        user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (firstName) user.firstName = firstName;
    if (lastName)  user.lastName  = lastName;
    if (email)     user.email     = email;
    // only admin can change roles
    if (role && req.user.role === 'admin') user.role = role;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();
    res.json({
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ───────────  DELETE /api/userdata/:id  ─────────── */
exports.deleteUserData = async (req, res) => {
  try {
    const user = await UserData.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
