const Activity = require('../models/activity.model')
const logger = require('../utils/logger')

// Get recent activities for global feed
const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(20)

    res.status(200).json({
      success: true,
      data: activities
    })
  } catch (error) {
    next(error)
  }
}

// Log a new activity (Internal helper)
const logActivity = async (data) => {
  try {
    const activity = await Activity.create(data)
    return activity
  } catch (error) {
    logger.error(`Failed to log activity: ${error.message}`)
  }
}

module.exports = { getRecentActivities, logActivity }
