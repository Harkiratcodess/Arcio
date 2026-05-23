const express = require('express')
const router = express.Router()
const { runIdeaScraper } = require('../jobs/ideas.scraper')
const { runMarketScraper } = require('../jobs/market.scraper')
const { runCommunityTask } = require('../jobs/community.task')
const logger = require('../utils/logger')

// Helper to send immediate response and force connection close
const sendSuccessAndClose = (res, body = 'OK') => {
  res.set({
    'Connection': 'close',
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(body).toString()
  })
  res.status(200).send(body)
}

// Utility to verify secret
const verifySecret = (req, res, next) => {
  const secret = req.query.secret || req.body?.secret
  if (secret !== process.env.CRON_SECRET) {
    logger.warn(`Unauthorized trigger attempt from ${req.ip}`)
    res.set({
      'Connection': 'close',
      'Content-Type': 'text/plain',
      'Content-Length': '12'
    })
    return res.status(401).send('Unauthorized')
  }
  next()
}

// Keep-alive ping endpoint (no secret required, keeps Render service awake)
router.route('/ping')
  .get((req, res) => {
    sendSuccessAndClose(res, 'pong')
  })
  .post((req, res) => {
    sendSuccessAndClose(res, 'pong')
  })

// Trigger Idea Scraper
router.route('/trigger-scraper')
  .get(verifySecret, (req, res) => {
    logger.info('Idea scraper triggered via GET webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runIdeaScraper()
        .then(result => logger.info(`Idea scraper finished: ${result?.count || 0} new ideas`))
        .catch(err => logger.error(`Idea scraper failed: ${err.message}`))
    }, 1000)
  })
  .post(verifySecret, (req, res) => {
    logger.info('Idea scraper triggered via POST webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runIdeaScraper()
        .then(result => logger.info(`Idea scraper finished: ${result?.count || 0} new ideas`))
        .catch(err => logger.error(`Idea scraper failed: ${err.message}`))
    }, 1000)
  })

// Trigger Market Scraper
router.route('/trigger-market')
  .get(verifySecret, (req, res) => {
    logger.info('Market scraper triggered via GET webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runMarketScraper()
        .then(result => logger.info(`Market scraper finished: ${result?.skillsCount || 0} skills, ${result?.newsCount || 0} news`))
        .catch(err => logger.error(`Market scraper failed: ${err.message}`))
    }, 1000)
  })
  .post(verifySecret, (req, res) => {
    logger.info('Market scraper triggered via POST webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runMarketScraper()
        .then(result => logger.info(`Market scraper finished: ${result?.skillsCount || 0} skills, ${result?.newsCount || 0} news`))
        .catch(err => logger.error(`Market scraper failed: ${err.message}`))
    }, 1000)
  })

// Trigger Community Maintenance Task
router.route('/trigger-community')
  .get(verifySecret, (req, res) => {
    logger.info('Community task triggered via GET webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runCommunityTask()
        .then(result => logger.info(`Community task finished`))
        .catch(err => logger.error(`Community task failed: ${err.message}`))
    }, 1000)
  })
  .post(verifySecret, (req, res) => {
    logger.info('Community task triggered via POST webhook')
    sendSuccessAndClose(res, 'OK')
    setTimeout(() => {
      runCommunityTask()
        .then(result => logger.info(`Community task finished`))
        .catch(err => logger.error(`Community task failed: ${err.message}`))
    }, 1000)
  })

module.exports = router

