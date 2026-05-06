const User = require('../models/user.model')
const { AppError } = require('./errorHandler')
const logger = require('../utils/logger')
const redis = require('../config/redis')

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
    dailyAnalyses: 3,
    fileAnalysisCount: 5  
  },
  pro: {
    dailyAnalyses: 10,
    fileAnalysisCount: 15 
  }
}

const checkUsageLimit = async (req, res, next) => {
  try {
    const userId = req.userId

    if (!userId) {
      return next(new AppError('Authentication required to analyze repos', 401))
    }

    const user = await User.findOne({ clerkId: userId })

    if (!user) {
      return next(new AppError('User not found. Please log in again.', 404))
    }

    const plan = user.plan || 'free'
    const limits = PLAN_LIMITS[plan]

    const today = new Date().toISOString().split('T')[0]
    const redisKey = `analyze:count:${userId}:${today}`
    
    let currentCount = 0
    try {
      const cachedCount = await redis.get(redisKey)
      currentCount = cachedCount ? parseInt(cachedCount) : 0
    } catch (err) {
      logger.error(`Redis error in usage check: ${err.message}`)
      // Fallback to DB if redis fails
      const now = new Date()
      const lastDate = user.usage?.lastAnalysisDate
      const isNewDay = !lastDate || new Date(lastDate).toDateString() !== now.toDateString()
      currentCount = isNewDay ? 0 : (user.usage?.dailyAnalysisCount || 0)
    }

    if (currentCount >= limits.dailyAnalyses) {
      logger.warn(`Usage limit hit: ${userId} (${plan} plan, ${currentCount}/${limits.dailyAnalyses})`)

      return res.status(429).json({
        success: false,
        message: `Daily analysis limit reached (${limits.dailyAnalyses}/${limits.dailyAnalyses})`,
        data: {
          plan,
          used: currentCount,
          limit: limits.dailyAnalyses,
          upgradeAvailable: plan === 'free'
        }
      })
    }

    req.userPlan = plan
    req.planLimits = limits
    req.currentUsage = currentCount
    req.userDoc = user
    req.redisKey = redisKey

    next()
  } catch (error) {
    logger.error(`Usage limit check failed: ${error.message}`)
    next(error)
  }
}

const incrementUsage = async (user, redisKey) => {
  try {
    // Increment in Redis with 24h TTL
    try {
      const count = await redis.incr(redisKey)
      if (count === 1) {
        await redis.expire(redisKey, 86400) // 1 day
      }
    } catch (err) {
      logger.error(`Redis increment failed: ${err.message}`)
    }

    // Still sync to DB for persistence and leaderboard
    await User.findByIdAndUpdate(user._id, {
      $set: {
        'usage.lastAnalysisDate': new Date()
      },
      $inc: { 
        'usage.dailyAnalysisCount': 1,
        'stats.reposAnalyzed': 1 
      }
    })

    logger.info(`Usage incremented for user ${user.clerkId}`)
  } catch (error) {
    logger.error(`Failed to increment usage: ${error.message}`)
  }
}

module.exports = { checkUsageLimit, incrementUsage, PLAN_LIMITS }

