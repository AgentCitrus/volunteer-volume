// server/routes/schedules.js
const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth')
const {
  assignSchedule,
  getMySchedules
} = require('../controllers/scheduleController')

// admin assigns a schedule
router.post('/', auth, assignSchedule)

// volunteer sees theirs (and admin can see all)
router.get('/me', auth, getMySchedules)

module.exports = router