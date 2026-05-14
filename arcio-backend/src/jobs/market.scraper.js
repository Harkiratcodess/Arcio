require('dotenv').config()
const mongoose = require('mongoose')
const { fetchMarketTrends, fetchMarketNews } = require('../services/marketData.service')
const { setCache } = require('../utils/cache')
const logger = require('../utils/logger')

/**
 * Market Data Scraper Job
 * Fetches live data from GitHub API + HackerNews + Dev.to
 * Caches results in Redis for fast frontend reads
 * Runs every 6 hours via cron, and once on server startup
 */
async function runMarketScraper() {
  try {
    logger.info('Starting Market Data Scraper Pipeline...')

    // 1. Fetch live skill trends from GitHub API
    logger.info('Fetching live skill trends from GitHub...')
    const skills = await fetchMarketTrends()
    
    if (skills && skills.length > 0) {
      await setCache('market:all-skills', skills, 3600 * 6) // Cache 6 hours
      logger.info(`✅ Market skills cached: ${skills.length} languages (${skills.filter(s => s.liveData).length} live)`)
    } else {
      logger.warn('No market skill data returned')
    }

    // 2. Fetch live tech news from HackerNews + Dev.to
    logger.info('Fetching live tech news from HN + Dev.to...')
    const news = await fetchMarketNews()
    
    if (news && news.length > 0) {
      await setCache('market:news', news, 3600 * 2) // Cache 2 hours
      logger.info(`✅ Market news cached: ${news.length} articles`)
    } else {
      logger.warn('No market news returned')
    }

    logger.info('Market Data Scraper Pipeline completed 🚀')
    return { success: true, skillsCount: skills?.length || 0, newsCount: news?.length || 0 }
  } catch (error) {
    logger.error(`Market Scraper Pipeline Error: ${error.message}`)
    throw error
  }
}

// Allow standalone execution: node src/jobs/market.scraper.js
if (require.main === module) {
  const run = async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
    }
    await runMarketScraper()
    process.exit(0)
  }
  run().catch(err => {
    console.error('Market scraper failed:', err)
    process.exit(1)
  })
}

module.exports = { runMarketScraper }
