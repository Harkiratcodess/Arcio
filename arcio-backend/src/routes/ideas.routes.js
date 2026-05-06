const express = require('express')
const router = express.Router()
const ideasController = require('../controllers/ideas.controller')
const { requireAuth } = require('../middleware/auth')

router.get('/', requireAuth, ideasController.getIdeas)
router.post('/builder', requireAuth, ideasController.ideaBuilder)
router.post('/scrape', requireAuth, ideasController.triggerScraper)

module.exports = router
