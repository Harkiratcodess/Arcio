const { Redis } = require('@upstash/redis')
const logger = require('../utils/logger')

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const testRedis = async () => {
  try {
    await redis.ping()
    logger.info('Redis connected: Upstash')
  } catch (error) {
    logger.error(`Redis connection failed: ${error.message}`)
  }
}

testRedis()

module.exports = redis