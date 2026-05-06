const redis = require('../config/redis')
const logger = require('./logger')

const setCache = async (key, data, expirySeconds = 3600) => {
  try {
    // @upstash/redis handles JSON.stringify automatically for objects
    await redis.set(key, data, { ex: expirySeconds })
    logger.info(`Cache set: ${key}`)
  } catch (error) {
    logger.error(`Cache set failed: ${error.message}`)
  }
}

const getCache = async (key) => {
  try {
    let data = await redis.get(key)
    if (data) {
      logger.info(`Cache hit: ${key}`)
      // If it's a string, try to parse it (handles legacy stringified data)
      if (typeof data === 'string') {
        try {
          return JSON.parse(data)
        } catch (e) {
          // If parsing fails, it's a plain string, return as is
          return data
        }
      }
      return data
    }
    logger.info(`Cache miss: ${key}`)
    return null
  } catch (error) {
    logger.error(`Cache get failed: ${error.message}`)
    return null
  }
}

const deleteCache = async (key) => {
  try {
    await redis.del(key)
    logger.info(`Cache deleted: ${key}`)
  } catch (error) {
    logger.error(`Cache delete failed: ${error.message}`)
  }
}

module.exports = { setCache, getCache, deleteCache }