const cron = require('node-cron')
const { runIdeaScraper } = require('./ideas.scraper')
const logger = require('../utils/logger')

const initScheduler = () => {
  logger.info('Initializing background job scheduler...')

  // Schedule the ideas scraper to run every 12 hours
  // 0 */12 * * * means at minute 0 of every 12th hour
  cron.schedule('0 */12 * * *', async () => {
    logger.info('Running scheduled ideas scraper job...')
    try {
      await runIdeaScraper()
      logger.info('Scheduled ideas scraper job finished.')
    } catch (error) {
      logger.error(`Scheduled ideas scraper job failed: ${error.message}`)
    }
  })

  logger.info('Scheduler: Ideas Scraper job scheduled (every 12 hours)')
}

module.exports = { initScheduler }
