// server/app.js
require('dotenv').config()

const express      = require('express')
const cors         = require('cors')
const morgan       = require('morgan')
const cookieParser = require('cookie-parser')
const mongoose     = require('mongoose')

const authRoutes      = require('./routes/auth')
const usersdataRoutes = require('./routes/usersdata')

const app = express()

// 1. Logging
app.use(morgan('dev'))

// 2. CORS
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET','POST','PATCH','DELETE','OPTIONS']
}))

// 3. Body & cookies
app.use(express.json())
app.use(cookieParser())

// 4. Routes
app.use('/api/auth', authRoutes)
app.use('/api',      usersdataRoutes)

// 5. MongoDB connection
mongoose.connect(process.env.MONG_URI)
  .then(() => console.log('🔗  MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

module.exports = app
