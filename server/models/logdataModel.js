const mongoose = require('mongoose');
const { Schema } = mongoose;

const logdataSchema = new Schema({
  user: {                       // ← link log to volunteer
    type: Schema.Types.ObjectId,
    ref:  'UserData',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  tasksDesc: {
    type: String,
    required: true,
    minLength: 75,
    maxLength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model('LogData', logdataSchema);
