require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes   = require('./routes/auth')
// const userdataRoutes = require('./routes/userdata')
// const logdataRoutes  = require('./routes/logdata')

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
// app.use('/api/userdata', userdataRoutes)
// app.use('/api/logdata',  logdataRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
