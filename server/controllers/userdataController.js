// server/controllers/userdataController.js
// — CRUD handlers for volunteer profile documents —

const UserData = require('../models/userdataModel');

/* GET /api/userdata  – list current user, or all if admin */
exports.getAllUserData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { _id: req.user._id };
    const users  = await UserData.find(filter).select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET /api/userdata/:id */
exports.getUserData = async (req, res) => {
  try {
    const user = await UserData.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* POST /api/userdata  – create a profile (admin only, typically) */
exports.addUserData = async (req, res) => {
  try {
    const user = await UserData.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* PATCH /api/userdata/:id */
exports.updateUserData = async (req, res) => {
  try {
    const user = await UserData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* DELETE /api/userdata/:id */
exports.deleteUserData = async (req, res) => {
  try {
    const user = await UserData.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
