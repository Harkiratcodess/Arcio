const express = require('express')
const router = express.Router()
const { 
  getGlobalLeaderboard, 
  getUserLeaderboard, 
  getLeaderboardBySkill 
} = require('../controllers/leaderboard.controller')
const { requireAuth } = require('../middleware/auth')

router.get('/global', getGlobalLeaderboard)
router.get('/user/:userId', getUserLeaderboard)
router.get('/skill/:skill', getLeaderboardBySkill)

module.exports = router
