const User = require('../models/user.model')
const { AppError } = require('./errorHandler')
const logger = require('../utils/logger')

// Plan limits configuration
const PLAN_LIMITS = {
  free: {
    dailyAnalyses: 2,
    fileAnalysisCount: 5  
  },
  pro: {
    dailyAnalyses: 7,
    fileAnalysisCount: 10 
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

    
    const now = new Date()
    const lastDate = user.usage?.lastAnalysisDate
    const isNewDay = !lastDate || 
      new Date(lastDate).toDateString() !== now.toDateString()

    let currentCount = isNewDay ? 0 : (user.usage?.dailyAnalysisCount || 0)

    if (currentCount >= limits.dailyAnalyses) {
      const resetTime = new Date(now)
      resetTime.setDate(resetTime.getDate() + 1)
      resetTime.setHours(0, 0, 0, 0)
      const hoursLeft = Math.ceil((resetTime - now) / (1000 * 60 * 60))

      logger.warn(`Usage limit hit: ${userId} (${plan} plan, ${currentCount}/${limits.dailyAnalyses})`)

      return res.status(429).json({
        success: false,
        message: `Daily analysis limit reached (${limits.dailyAnalyses}/${limits.dailyAnalyses})`,
        data: {
          plan,
          used: currentCount,
          limit: limits.dailyAnalyses,
          resetsIn: `${hoursLeft} hours`,
          upgradeAvailable: plan === 'free'
        }
      })
    }

    req.userPlan = plan
    req.planLimits = limits
    req.currentUsage = currentCount
    req.userDoc = user
    req.isNewDay = isNewDay

    next()
  } catch (error) {
    logger.error(`Usage limit check failed: ${error.message}`)
    next(error)
  }
}

const incrementUsage = async (user, isNewDay) => {
  try {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        'usage.dailyAnalysisCount': isNewDay ? 1 : (user.usage?.dailyAnalysisCount || 0) + 1,
        'usage.lastAnalysisDate': new Date()
      },
      $inc: { 'stats.reposAnalyzed': 1 }
    })

    logger.info(`Usage incremented for user ${user.clerkId}`)
  } catch (error) {
    logger.error(`Failed to increment usage: ${error.message}`)
  }
}

module.exports = { checkUsageLimit, incrementUsage, PLAN_LIMITS }
