const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { errorHandler } = require('./src/middleware/errorHandler')
const { apiLimiter } = require('./src/middleware/rateLimiter')
const logger = require('./src/utils/logger')

const app = express()

app.use(helmet())


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))


app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}))

app.use('/api', apiLimiter)


app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Arcio API is running',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Routes
app.use('/api/users', require('./src/routes/user.routes'))

app.use(errorHandler)

module.exports = app