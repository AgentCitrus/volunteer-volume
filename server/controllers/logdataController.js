const LogData = require('../models/logdataModel');

/* create new entry — POST /api/logdata */
exports.addLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body;

    const entry = await LogData.create({
      user: req.user._id,          // ← tie to current volunteer
      checkIn,
      checkOut,
      tasksDesc
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* list my logs (admin sees all) — GET /api/logdata */
exports.getAllLogData = async (req, res) => {
  const filter = req.user.role === 'admin'
    ? {}
    : { user: req.user._id };
  const logs = await LogData.find(filter).sort('-createdAt');
  res.json(logs);
};

/* other CRUD handlers unchanged … */
