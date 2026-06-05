const mongoose = require('mongoose')
const dns = require('dns')
const logger = require('../utils/logger')

// Use Google Public DNS to resolve MongoDB Atlas SRV records
// This fixes issues where local/router DNS can't resolve SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4'])

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    logger.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB