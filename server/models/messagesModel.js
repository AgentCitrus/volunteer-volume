// server/models/messageModel.js
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', default: null }, // null means broadcast
  content:   { type: String, required: true },
  sentAt:    { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)