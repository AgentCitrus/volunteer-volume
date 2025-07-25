// server/index.js
require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes      = require('./routes/auth')
const usersdataRoutes = require('./routes/usersdata')   // contains both /userdata & /logdata

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(cookieParser())

// auth endpoints
app.use('/api/auth', authRoutes)

// time-clock & profile endpoints
app.use('/api', usersdataRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
