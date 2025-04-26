// server/controllers/scheduleController.js
const Schedule = require('../models/scheduleModel')

// admin assigns a time slot
exports.assignSchedule = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' })

    const { userId, start, end } = req.body
    if (!userId || !start || !end)
      return res.status(400).json({ error: 'Missing fields' })

    const sched = await Schedule.create({
      user:  userId,
      start: new Date(start),
      end:   new Date(end)
    })
    res.status(201).json(sched)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// volunteer or admin views their own
exports.getMySchedules = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { }                       // optional: admin sees all
      : { user: req.user._id }    // volunteer only theirs

    const schedules = await Schedule.find(filter)
      .populate('user', 'firstName lastName email')
      .sort('start')
    res.json(schedules)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}