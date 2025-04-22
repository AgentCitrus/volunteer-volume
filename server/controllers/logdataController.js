// server/controllers/logdataController.js
const LogData = require('../models/logdataModel');

/* ───────────  POST /api/logdata  ───────────  */
exports.addLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body;

    const entry = await LogData.create({
      user: req.user._id,     // link to current volunteer
      checkIn,
      checkOut,
      tasksDesc
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ───────────  GET /api/logdata  ───────────  (list) */
exports.getAllLogData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { user: req.user._id };

    const logs = await LogData.find(filter).sort('-createdAt');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────  GET /api/logdata/:id  ───────────  (single) */
exports.getLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id);

    if (!log) return res.status(404).json({ error: 'Not found' });

    // non‑admin can only access their own log
    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ───────────  PATCH /api/logdata/:id  ─────────── */
exports.updateLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(log, req.body);
    await log.save();

    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ───────────  DELETE /api/logdata/:id  ─────────── */
exports.deleteLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await log.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
