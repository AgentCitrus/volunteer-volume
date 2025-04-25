// server/index.js
require('dotenv').config()
const express      = require('express')
const mongoose     = require('mongoose')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

// Import all your route modules
const authRoutes      = require('./routes/auth')
const userDataRoutes  = require('./routes/usersdata') // this file handles BOTH userdata & logdata

const app = express()

// Connect to MongoDB
mongoose
  .connect(process.env.MONG_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Middleware
app.use(
  cors({
    origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

// Mount your routes
app.use('/api/auth', authRoutes)     // handles /api/auth/...
app.use('/api',      userDataRoutes) // handles both /api/userdata and /api/logdata

// Start server
const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`)
})
