// server/controllers/logdataController.js
const LogData = require('../models/logdataModel')

/* ───────────  POST /api/logdata  ─────────── */
exports.addLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body
    const entry = await LogData.create({
      user:      req.user._id,
      checkIn,
      checkOut,
      tasksDesc
    })
    res.status(201).json(entry)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ───────────  GET /api/logdata  ─────────── */
exports.getAllLogData = async (req, res) => {
  try {
    // Always restrict to the logged-in user's own entries:
    const filter = { user: req.user._id }

    const logs = await LogData.find(filter)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')

    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ───────────  GET /api/logdata/:id  ─────────── */
exports.getLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
      .populate('user', 'firstName lastName email')

    if (!log) return res.status(404).json({ error: 'Not found' })
    // Only the owner may view their entry:
    if (log.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    res.json(log)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ───────────  PATCH /api/logdata/:id  ─────────── */
exports.updateLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body
    const log = await LogData.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Not found' })
    // Only the owner may update:
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    log.checkIn   = checkIn
    log.checkOut  = checkOut
    log.tasksDesc = tasksDesc
    await log.save()
    res.json(log)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* ───────────  DELETE /api/logdata/:id  ─────────── */
exports.deleteLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Not found' })
    // Only the owner may delete:
    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    await log.deleteOne()
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
