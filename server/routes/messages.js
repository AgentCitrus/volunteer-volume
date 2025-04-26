// server/routes/messages.js
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  sendMessage,
  getMyMessages
} = require('../controllers/messagesController')

// admin sends a message
router.post('/', auth, sendMessage)

// volunteer or admin sees their messages
router.get('/me', auth, getMyMessages)

module.exports = router