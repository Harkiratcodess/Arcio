const { Queue } = require('bullmq')
const Redis = require('ioredis')
const { runIdeaScraper } = require('./ideas.scraper')
const logger = require('../utils/logger')

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
})

const ideaQueue = new Queue('ideas', { connection: redis })

// Schedule job to run every Sunday at 2 AM
ideaQueue.add(
  'scrape-ideas',
  { timestamp: Date.now() },
  {
    repeat: {
      pattern: '0 2 * * 0' // Sunday 2 AM
    }
  }
)

// Process the job
ideaQueue.process('scrape-ideas', async (job) => {
  logger.info('Processing scheduled ideas scrape...')
  await runIdeaScraper()
  return { success: true, timestamp: new Date() }
})

// Log events
ideaQueue.on('completed', (job) => {
  logger.info(`Job ${job.id} completed: ${job.data}`)
})

ideaQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`)
})

module.exports = { ideaQueue }