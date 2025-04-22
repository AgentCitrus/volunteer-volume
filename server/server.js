// server/server.js
require('dotenv').config()
const express       = require('express')
const cors          = require('cors')
const morgan        = require('morgan')
const cookieParser  = require('cookie-parser')
const mongoose      = require('mongoose')

const authRoutes      = require('./routes/auth')
const usersdataRoutes = require('./routes/usersdata')

const app = express()

// Log all requests
app.use(morgan('dev'))

// Enable CORS for your React app (on port 3000)
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true
}))

// Parse JSON bodies and cookies
app.use(express.json())
app.use(cookieParser())

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api', usersdataRoutes)

// Connect & start
mongoose.connect(process.env.MONG_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  const port = process.env.PORT || 5001
  app.listen(port, () => console.log(`Server listening on port ${port}`))
})
.catch(err => console.error('Mongo connection error:', err))
