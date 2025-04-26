// server/models/scheduleModel.js
const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  start: { type: Date, required: true },
  end:   { type: Date, required: true }
}, {
  timestamps: true
})

module.exports = mongoose.model('Schedule', scheduleSchema)