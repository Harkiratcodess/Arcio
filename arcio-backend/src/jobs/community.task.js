const Activity = require('../models/activity.model')
const User = require('../models/user.model')
const logger = require('../utils/logger')

/**
 * Community Task
 * Keeps the community feed alive and ensures a healthy competitive environment.
 */
async function runCommunityTask() {
  try {
    logger.info('Starting Community Maintenance Task...')

    // 1. Ensure some diverse activities exist
    const recentActivities = await Activity.find().sort({ timestamp: -1 }).limit(10)
    
    // If feed is slow, add a simulated milestone or system update
    if (recentActivities.length < 10) {
      const simulatedEvents = [
        {
          userName: 'Arcio Bot',
          type: 'milestone',
          repoName: 'Trending Repos',
          score: 95,
          timestamp: new Date()
        },
        {
          userName: 'System',
          type: 'update',
          repoName: 'Market Pulse',
          score: 0,
          timestamp: new Date()
        }
      ]
      
      const event = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)]
      await Activity.create({
        ...event,
        userId: 'system_arcio',
        userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${event.userName}`
      })
      logger.info('Added simulated community activity')
    }

    // 2. Performance Check: Ensure leaderboard has at least some "Benchmark" users
    // This helps the "Competing with user" aspect by providing targets
    const userCount = await User.countDocuments()
    if (userCount < 10) {
      logger.info('Low user count. Adding benchmark developers for competition...')
      const benchmarks = [
        { clerkId: 'bot_alpha', name: 'EliteDev_01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elite1', stats: { topScore: 98, reposAnalyzed: 42 }, profile: { techStack: ['Rust', 'Zig', 'C++'] } },
        { clerkId: 'bot_beta', name: 'OpenSource_Hero', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero', stats: { topScore: 89, reposAnalyzed: 156 }, profile: { techStack: ['JavaScript', 'TypeScript', 'Next.js'] } }
      ]
      
      for (const b of benchmarks) {
        await User.findOneAndUpdate({ clerkId: b.clerkId }, b, { upsert: true })
      }
    }

    logger.info('Community Maintenance Task completed.')
    return { success: true, message: 'Community feed and competition pool are healthy' }
  } catch (error) {
    logger.error(`Community Task Error: ${error.message}`)
    throw error
  }
}

module.exports = { runCommunityTask }

