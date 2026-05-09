const User = require('../models/user.model')
const Analysis = require('../models/analysis.model')
const { getCache, setCache } = require('../utils/cache')
const { AppError } = require('../middleware/errorHandler')

// Get top 100 users by top score
const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const cacheKey = 'leaderboard:global'
    const cached = await getCache(cacheKey)
    
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        cached: true
      })
    }

    const topUsers = await User.find({ 'stats.reposAnalyzed': { $gt: 0 } })
      .sort({ 'stats.topScore': -1 })
      .limit(100)
      .select('name avatar stats profile.techStack')

    const totalUsers = await User.countDocuments({ 'stats.reposAnalyzed': { $gt: 0 } })

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      avatar: user.avatar,
      topScore: user.stats.topScore,
      reposAnalyzed: user.stats.reposAnalyzed,
      techStack: user.profile.techStack,
      percentile: totalUsers > 0 ? Math.round(((totalUsers - index) / totalUsers) * 100) : 100
    }))

    await setCache(cacheKey, leaderboard, 3600) // 1 hour

    res.status(200).json({
      success: true,
      data: leaderboard,
      totalUsers
    })
  } catch (error) {
    next(error)
  }
}

// Get specific user position and context
const getUserLeaderboard = async (req, res, next) => {
  try {
    const { userId } = req.params // clerkId
    
    const user = await User.findOne({ clerkId: userId })
    if (!user) return next(new AppError('User not found', 404))

    const topScore = user.stats.topScore
    
    // Count how many users have a higher topScore
    const rank = await User.countDocuments({ 
      'stats.topScore': { $gt: topScore },
      'stats.reposAnalyzed': { $gt: 0 }
    }) + 1

    const totalUsers = await User.countDocuments({ 'stats.reposAnalyzed': { $gt: 0 } })
    const percentile = totalUsers > 0 ? Math.round(((totalUsers - rank + 1) / totalUsers) * 100) : 100


    const userIndex = await User.find({ 
      'stats.topScore': { $gt: topScore },
      'stats.reposAnalyzed': { $gt: 0 }
    }).countDocuments()

    const start = Math.max(0, userIndex - 5)
    const contextUsers = await User.find({ 'stats.reposAnalyzed': { $gt: 0 } })
      .sort({ 'stats.topScore': -1 })
      .skip(start)
      .limit(11)
      .select('name stats clerkId')

    const nearestAhead = contextUsers.find(u => u.stats.topScore > topScore)

    res.status(200).json({
      success: true,
      data: {
        rank,
        percentile,
        topScore,
        totalUsers,
        nearestAhead: nearestAhead ? {
          name: nearestAhead.name,
          score: nearestAhead.stats.topScore,
          gap: nearestAhead.stats.topScore - topScore
        } : null,
        history: await Analysis.find({ userId, public: true })
          .sort({ analyzedAt: -1 })
          .limit(10)
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get top users for a specific skill
const getLeaderboardBySkill = async (req, res, next) => {
  try {
    const { skill } = req.params
    
    const topUsers = await User.find({ 
      'profile.techStack': { $regex: new RegExp(skill, 'i') },
      'stats.reposAnalyzed': { $gt: 0 }
    })
    .sort({ 'stats.topScore': -1 })
    .limit(50)
    .select('name avatar stats profile.techStack')

    res.status(200).json({
      success: true,
      data: topUsers.map((u, i) => ({
        rank: i + 1,
        name: u.name,
        avatar: u.avatar,
        score: u.stats.topScore,
        techStack: u.profile.techStack
      }))
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getGlobalLeaderboard,
  getUserLeaderboard,
  getLeaderboardBySkill
}
