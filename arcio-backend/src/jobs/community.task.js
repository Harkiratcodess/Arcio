const mongoose = require('mongoose')
const Activity = require('../models/activity.model')
const logger = require('../utils/logger')

/**
 * Community Task
 * Keeps the community feed alive by adding system/meta activities
 * or refreshing community stats.
 */
async function runCommunityTask() {
  try {
    logger.info('Starting Community Maintenance Task...')

    // For now, let's just ensure we have at least some "Welcome" or "Pulse" activities
    // In a real app, this might fetch latest forum posts or Discord events
    
    const count = await Activity.countDocuments()
    
    if (count < 5) {
      logger.info('Community feed low on activities. Adding some pulse activities...')
      await Activity.create({
        userId: 'system_arcio',
        userName: 'Arcio System',
        userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=arcio',
        type: 'new_member',
        timestamp: new Date(),
        metadata: { message: 'Community pulse check: All systems operational 🚀' }
      })
    }

    logger.info('Community Maintenance Task completed.')
    return { success: true, message: 'Community feed is healthy' }
  } catch (error) {
    logger.error(`Community Task Error: ${error.message}`)
    throw error
  }
}

module.exports = { runCommunityTask }
