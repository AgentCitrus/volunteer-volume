// server/controllers/logdataController.js
const LogData = require('../models/logdataModel')

// Helper to check ownership or admin
function ensureCanAccess(entry, user) {
  // If you’re admin, anything goes
  if (user.role === 'admin') return true
  // Otherwise, you must own it
  return entry.user.toString() === user._id.toString()
}

exports.getAllLogData = async (req, res) => {
  try {
    let logs
    if (req.user.role === 'admin') {
      // Admin sees everything
      logs = await LogData.find().sort('-createdAt')
    } else {
      // Volunteers only see their own
      logs = await LogData.find({ user: req.user._id }).sort('-createdAt')
    }
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getLogData = async (req, res) => {
  try {
    const entry = await LogData.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })

    if (!ensureCanAccess(entry, req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    res.json(entry)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addLogData = async (req, res) => {
  try {
    const entry = await LogData.create({
      user:     req.user._id,
      checkIn:  req.body.checkIn,
      checkOut: req.body.checkOut,
      tasksDesc:req.body.tasksDesc
    })
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.updateLogData = async (req, res) => {
  try {
    const entry = await LogData.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })

    if (!ensureCanAccess(entry, req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    Object.assign(entry, req.body)
    await entry.save()
    res.json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.deleteLogData = async (req, res) => {
  try {
    const entry = await LogData.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })

    if (!ensureCanAccess(entry, req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await entry.remove()
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
