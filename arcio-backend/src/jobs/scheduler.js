const cron = require('node-cron')
const { runIdeaScraper } = require('./ideas.scraper')
const { runMarketScraper } = require('./market.scraper')
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

  // Schedule market data refresh every 6 hours
  // 0 */6 * * * means at minute 0 of every 6th hour
  cron.schedule('0 */6 * * *', async () => {
    logger.info('Running scheduled market data refresh...')
    try {
      await runMarketScraper()
      logger.info('Scheduled market data refresh finished.')
    } catch (error) {
      logger.error(`Scheduled market data refresh failed: ${error.message}`)
    }
  })

  // Run market scraper once on startup (fresh data immediately)
  setTimeout(async () => {
    logger.info('Running initial market data fetch on startup...')
    try {
      await runMarketScraper()
      logger.info('Initial market data fetch completed.')
    } catch (error) {
      logger.error(`Initial market data fetch failed: ${error.message}`)
    }
  }, 5000) // 5 second delay to let server fully start

  logger.info('Scheduler: Ideas Scraper job scheduled (every 12 hours)')
  logger.info('Scheduler: Market Data refresh scheduled (every 6 hours)')
}

module.exports = { initScheduler }
