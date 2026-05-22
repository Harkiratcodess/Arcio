const Activity = require('../models/activity.model')
const User = require('../models/user.model')
const logger = require('../utils/logger')

async function runCommunityTask() {
  try {
    logger.info('Starting Community Maintenance Task...')

    // 1. ✅ FIX: Check for activity in the last hour, not just a count of 10
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentActivities = await Activity.find({
      timestamp: { $gte: oneHourAgo }
    })

    // ✅ FIX: Correct trigger — "no activity in last hour" instead of "less than 10 total"
    if (recentActivities.length === 0) {
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
      logger.info('Added simulated community activity (feed was quiet)')
    }

    // 2. Benchmark users — only upsert if under 10 real users
    const userCount = await User.countDocuments()
    if (userCount < 10) {
      logger.info('Low user count — upserting benchmark developers...')
      const benchmarks = [
        {
          clerkId: 'bot_alpha',
          name: 'EliteDev_01',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elite1',
          stats: { topScore: 98, reposAnalyzed: 42 },
          profile: { techStack: ['Rust', 'Zig', 'C++'] }
        },
        {
          clerkId: 'bot_beta',
          name: 'OpenSource_Hero',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero',
          stats: { topScore: 89, reposAnalyzed: 156 },
          profile: { techStack: ['JavaScript', 'TypeScript', 'Next.js'] }
        }
      ]

      for (const b of benchmarks) {
        await User.findOneAndUpdate({ clerkId: b.clerkId }, b, { upsert: true })
      }
      logger.info('Benchmark developers upserted')
    }

    logger.info('Community Maintenance Task completed.')
    return { success: true, message: 'Community feed and competition pool are healthy' }

  } catch (error) {
    logger.error(`Community Task Error: ${error.message}`)
    throw error
  }
}

module.exports = { runCommunityTask }