// server/server.js
const app  = require('./app')
const PORT = process.env.PORT || 5001

// Only start listening when not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('Server listening on port ${PORT}`)
  })
}
