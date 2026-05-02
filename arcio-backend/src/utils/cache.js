const redis = require('../config/redis')
const logger = require('./logger')

const setCache = async (key, data, expirySeconds = 3600) => {
  try {
    await redis.set(key, JSON.stringify(data), { ex: expirySeconds })
    logger.info(`Cache set: ${key}`)
  } catch (error) {
    logger.error(`Cache set failed: ${error.message}`)
  }
}

const getCache = async (key) => {
  try {
    const data = await redis.get(key)
    if (data) {
      logger.info(`Cache hit: ${key}`)
      return JSON.parse(data)
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