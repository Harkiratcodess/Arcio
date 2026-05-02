const rateLimit = require('express-rate-limit')
const logger = require('../utils/logger')


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit hit: ${req.ip}`)
    res.status(429).json(options.message)
  }
})

const analyzerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Analysis limit reached, please try again in an hour'
  },
  handler: (req, res, next, options) => {
    logger.warn(`Analyzer rate limit hit: ${req.ip}`)
    res.status(429).json(options.message)
  }
})

module.exports = { apiLimiter, analyzerLimiter }