const cron = require('node-cron')
const { runIdeaScraper } = require('./ideas.scraper')
const { runMarketScraper } = require('./market.scraper')
const { runCommunityTask } = require('./community.task')
const logger = require('../utils/logger')

const initScheduler = () => {
  logger.info('Initializing background job scheduler...')

  // Community maintenance — every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Running community maintenance task...')
    try {
      await runCommunityTask()
      logger.info('Community maintenance task finished.')
    } catch (error) {
      logger.error(`Community maintenance task failed: ${error.message}`)
    }
  })

  // Ideas scraper — every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    logger.info('Running scheduled ideas scraper job...')
    try {
      await runIdeaScraper()
      logger.info('Scheduled ideas scraper job finished.')
    } catch (error) {
      logger.error(`Scheduled ideas scraper job failed: ${error.message}`)
    }
  })

  // Market data refresh — every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running scheduled market data refresh...')
    try {
      await runMarketScraper()
      logger.info('Scheduled market data refresh finished.')
    } catch (error) {
      logger.error(`Scheduled market data refresh failed: ${error.message}`)
    }
  })

  // Run market scraper once on startup
  setTimeout(async () => {
    logger.info('Running initial market data fetch on startup...')
    try {
      await runMarketScraper()
      logger.info('Initial market data fetch completed.')
    } catch (error) {
      logger.error(`Initial market data fetch failed: ${error.message}`)
    }
  }, 5000)

  logger.info('Scheduler: Community Maintenance scheduled (every hour)')
  logger.info('Scheduler: Ideas Scraper scheduled (every 12 hours)')
  logger.info('Scheduler: Market Data refresh scheduled (every 6 hours)')
}

module.exports = { initScheduler }