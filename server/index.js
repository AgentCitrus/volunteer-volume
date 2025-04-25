// server/index.js
require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

// Import all your route modules
const authRoutes     = require('./routes/auth')
const userdataRoutes = require('./routes/userdata')
const logdataRoutes  = require('./routes/logdata')

const app = express()

// CORS: allow your React front-end to talk to this server
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
)

// Parse JSON bodies + cookies
app.use(express.json())
app.use(cookieParser())

// Mount the routes
app.use('/api/auth',     authRoutes)
app.use('/api/userdata', userdataRoutes)
app.use('/api/logdata',  logdataRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`)
})
