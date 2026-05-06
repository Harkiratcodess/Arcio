require('dotenv').config()
require('./src/config/ai')
require('./src/config/github')
const app = require('./app')
const connectDB = require('./src/config/db')
const logger = require('./src/utils/logger')
const { initScheduler } = require('./src/jobs/scheduler')

const startServer = async () => {
  try {
    await connectDB()
    
    // Start background jobs
    initScheduler()
    
    const PORT = process.env.PORT || 5000
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