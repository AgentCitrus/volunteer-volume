// server/server.js
require('dotenv').config()

const express      = require('express')
const mongoose     = require('mongoose')
const cors         = require('cors')
const morgan       = require('morgan')
const cookieParser = require('cookie-parser')

const authRoutes      = require('./routes/auth')
const usersdataRoutes = require('./routes/usersdata')

const app = express()

// 1. Logging incoming requests
app.use(morgan('dev'))

// 2. Enable CORS so your client at localhost:3000 can send cookies
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// 3. Parse JSON bodies & cookies
app.use(express.json())
app.use(cookieParser())

// 4. Mount your routes
app.use('/api/auth', authRoutes)
app.use('/api',      usersdataRoutes)

// 5. Connect to MongoDB & start the server
const PORT = process.env.PORT || 5001
mongoose.connect(process.env.MONG_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
})
.catch(err => {
  console.error('Mongo connection error:', err)
  process.exit(1)
})
