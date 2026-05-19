const express = require('express')
const router = express.Router()
const { runIdeaScraper } = require('../jobs/ideas.scraper')
const { runMarketScraper } = require('../jobs/market.scraper')
const { runCommunityTask } = require('../jobs/community.task')
const logger = require('../utils/logger')

// Utility to verify secret
const verifySecret = (req, res, next) => {
  const { secret } = req.query
  if (secret !== process.env.CRON_SECRET) {
    logger.warn(`Unauthorized trigger attempt from ${req.ip}`)
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  next()
}

router.get('/trigger-scraper', verifySecret, (req, res) => {
  logger.info('Idea scraper triggered via external webhook')
  
  res.status(200).end()

  runIdeaScraper()
    .then(result => logger.info(`Idea scraper finished: ${result?.count || 0} new ideas`))
    .catch(err => logger.error(`Idea scraper failed: ${err.message}`))
})

router.get('/trigger-market', verifySecret, (req, res) => {
  logger.info('Market scraper triggered via external webhook')
  
  res.status(200).end()

  runMarketScraper()
    .then(result => logger.info(`Market scraper finished: ${result?.skillsCount || 0} skills, ${result?.newsCount || 0} news`))
    .catch(err => logger.error(`Market scraper failed: ${err.message}`))
})

router.get('/trigger-community', verifySecret, (req, res) => {
  logger.info('Community task triggered via external webhook')
  
  res.status(200).end()

  runCommunityTask()
    .then(result => logger.info(`Community task finished`))
    .catch(err => logger.error(`Community task failed: ${err.message}`))
})

module.exports = router

