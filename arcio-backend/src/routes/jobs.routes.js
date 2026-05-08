const express = require('express')
const router = express.Router()
const { runIdeaScraper } = require('../jobs/ideas.scraper')
const logger = require('../utils/logger')

router.get('/trigger-scraper', async (req, res) => {
  const { secret } = req.query

  if (secret !== process.env.CRON_SECRET) {
    logger.warn(`Unauthorized scraper trigger attempt from ${req.ip}`)
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  logger.info('Scraper triggered via external webhook')
  
  // We run it in the background so the request doesn't timeout
  runIdeaScraper()
    .then(result => logger.info(`External scraper run finished: ${JSON.stringify(result)}`))
    .catch(err => logger.error(`External scraper run failed: ${err.message}`))

  res.json({ 
    success: true, 
    message: 'Scraper pipeline initiated in background' 
  })
})

module.exports = router
