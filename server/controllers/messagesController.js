// server/controllers/messageController.js
const Message = require('../models/messagesModel')

// admin sends a message
exports.sendMessage = async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' })

    const { recipient, content } = req.body
    if (!content)
      return res.status(400).json({ error: 'Missing content' })

    const message = await Message.create({
      sender: req.user._id,
      recipient: recipient || null, // null = broadcast to everyone
      content: content,
      sentAt: new Date()
    })
    res.status(201).json(message)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// volunteer or admin views their own messages
exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { recipient: null },            // broadcasted to everyone
        { recipient: req.user._id }      // or directly sent to me
      ]
    })
      .populate('sender', 'firstName lastName email')
      .sort('-sentAt')
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}