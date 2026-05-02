const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const connectDB = require('./src/config/db')
const redis = require('./src/config/redis')
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



app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`)
    })
  } catch (error) {
    logger.error(`Server failed to start: ${error.message}`)
    process.exit(1)
  }
}

startServer()