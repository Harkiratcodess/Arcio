const express = require('express')
const router = express.Router()
const { getRecentActivities } = require('../controllers/activity.controller')

// Public routes for the news feed
router.get('/activities', getRecentActivities)

module.exports = router
