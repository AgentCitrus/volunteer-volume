// server/controllers/userdataController.js
const UserData = require('../models/userdataModel');

/* GET /api/userdata  – list current user, or all if admin */
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
    // volunteers can only fetch their own
    if (req.user.role !== 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* POST /api/userdata */
exports.addUserData = async (req, res) => {
  try {
    // ... your existing create logic ...
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* PATCH /api/userdata/:id */
exports.updateUserData = async (req, res) => {
  try {
    // Prevent duplicate email
    const existsEmail = await UserData.findOne({
      email: req.body.email,
      _id:   { $ne: req.params.id }
    });
    if (existsEmail) {
      return res
        .status(400)
        .json({ error: 'Validation failed: email: Email already in use.' });
    }

    // Prevent duplicate phone number
    const existsPhone = await UserData.findOne({
      phoneNumber: req.body.phoneNumber,
      _id:         { $ne: req.params.id }
    });
    if (existsPhone) {
      return res
        .status(400)
        .json({ error: 'Validation failed: phoneNumber: Phone number already in use.' });
    }

    const user = await UserData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    // handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors)
        .map(e => `${e.path}: ${e.message}`)
        .join(', ');
      return res
        .status(400)
        .json({ error: 'Validation failed: ' + messages });
    }
    res.status(500).json({ error: err.message });
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
