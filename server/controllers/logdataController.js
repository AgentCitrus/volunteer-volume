<<<<<<< HEAD
const LogData = require('../models/logdataModel')
=======
// server/controllers/logdataController.js
const LogData = require('../models/logdataModel');
>>>>>>> parent of c3b1a79 (Admin dashboard)

exports.addLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body
    const entry = await LogData.create({
<<<<<<< HEAD
      user:      req.user._id,
      checkIn:   new Date(checkIn),
      checkOut:  new Date(checkOut),
=======
      user: req.user._id,     // link to current volunteer
      checkIn,
      checkOut,
>>>>>>> parent of c3b1a79 (Admin dashboard)
      tasksDesc
    })
    res.status(201).json(entry)
  } catch (err) {
<<<<<<< HEAD
    res.status(400).json({ error: err.message })
=======
    res.status(400).json({ error: err.message });
>>>>>>> parent of c3b1a79 (Admin dashboard)
  }
}

<<<<<<< HEAD
=======
/* ───────────  GET /api/logdata  ───────────  (list) */
>>>>>>> parent of c3b1a79 (Admin dashboard)
exports.getAllLogData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
<<<<<<< HEAD
      : { user: req.user._id }
    const logs = await LogData.find(filter)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
    res.json(logs)
=======
      : { user: req.user._id };

    const logs = await LogData.find(filter).sort('-createdAt');
    res.json(logs);
>>>>>>> parent of c3b1a79 (Admin dashboard)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

<<<<<<< HEAD
exports.getLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
      .populate('user', 'firstName lastName email')
    if (!log) return res.status(404).json({ error: 'Not found' })
    if (req.user.role !== 'admin' && log.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Forbidden' })
    res.json(log)
=======
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
>>>>>>> parent of c3b1a79 (Admin dashboard)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

<<<<<<< HEAD
exports.updateLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body
    const log = await LogData.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Not found' })
    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Forbidden' })
    if (checkIn)   log.checkIn   = new Date(checkIn)
    if (checkOut)  log.checkOut  = new Date(checkOut)
    if (tasksDesc) log.tasksDesc = tasksDesc
    await log.save()
    res.json(log)
  } catch (err) {
    res.status(400).json({ error: err.message })
=======
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
>>>>>>> parent of c3b1a79 (Admin dashboard)
  }
}

<<<<<<< HEAD
exports.deleteLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Not found' })
    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Forbidden' })
    await log.deleteOne()
    res.status(204).end()
=======
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
>>>>>>> parent of c3b1a79 (Admin dashboard)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
