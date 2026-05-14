const express = require('express')
const router = express.Router()
const { getAllSkills, getUserMarketAnalysis, getSkillDetails, getMarketNews } = require('../controllers/market.controller')
const { requireAuth } = require('../middleware/auth')

router.get('/skills', getAllSkills)
router.get('/news', getMarketNews)
router.get('/user-analysis', requireAuth, getUserMarketAnalysis)
router.get('/skill/:skillName', getSkillDetails)

module.exports = router