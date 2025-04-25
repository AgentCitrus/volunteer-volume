const LogData = require('../models/logdataModel')

exports.addLogData = async (req, res) => {
  try {
    const { checkIn, checkOut, tasksDesc } = req.body
    const entry = await LogData.create({
      user:      req.user._id,
      checkIn:   new Date(checkIn),
      checkOut:  new Date(checkOut),
      tasksDesc
    })
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.getAllLogData = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { user: req.user._id }
    const logs = await LogData.find(filter)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
      .populate('user', 'firstName lastName email')
    if (!log) return res.status(404).json({ error: 'Not found' })
    if (req.user.role !== 'admin' && log.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Forbidden' })
    res.json(log)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

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
  }
}

exports.deleteLogData = async (req, res) => {
  try {
    const log = await LogData.findById(req.params.id)
    if (!log) return res.status(404).json({ error: 'Not found' })
    if (req.user.role !== 'admin' && log.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Forbidden' })
    await log.deleteOne()
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
