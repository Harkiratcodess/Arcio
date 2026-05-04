const express = require('express')
const router = express.Router()
const { analyzeRepo, chatAboutRepo, getUsageStats } = require('../controllers/analyzer.controller')
const { requireAuth } = require('../middleware/auth')
const { checkUsageLimit } = require('../middleware/usageLimit')
const { analyzerLimiter } = require('../middleware/rateLimiter')

router.post('/analyze', requireAuth, analyzerLimiter, checkUsageLimit, analyzeRepo)

router.post('/chat', requireAuth, chatAboutRepo)

router.get('/usage', requireAuth, getUsageStats)

module.exports = router