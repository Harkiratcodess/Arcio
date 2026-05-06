const MarketData = require('../models/marketData.model')
const User = require('../models/user.model')
const { getCache, setCache } = require('../utils/cache')
const logger = require('../utils/logger')

// Get all skills with demand scores
const getAllSkills = async (req, res, next) => {
  try {
    const cacheKey = 'market:all-skills'
    const cached = await getCache(cacheKey)
    
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        cached: true
      })
    }

    const skills = await MarketData.find()
      .sort({ demand: -1 })
      .limit(50)

    await setCache(cacheKey, skills.map(s => s.toObject()), 3600) // 1 hour

    res.status(200).json({
      success: true,
      data: skills
    })
  } catch (error) {
    next(error)
  }
}

// Get market analysis for logged-in user
const getUserMarketAnalysis = async (req, res, next) => {
  try {
    const { userId } = req

    // Get user's tech stack
    const user = await User.findOne({ clerkId: userId })
    if (!user) return next(new AppError('User not found', 404))

    const userStack = user.profile?.techStack || []

    // Get all skills
    const allSkills = await MarketData.find().sort({ demand: -1 })

    // Categorize user's skills vs market
    const userSkillsData = []
    const recommendedSkills = []

    allSkills.forEach(skill => {
      const userHasIt = userStack.some(s => s.toLowerCase() === skill.skill.toLowerCase())

      if (userHasIt) {
        userSkillsData.push({
          skill: skill.skill,
          demand: skill.demand,
          trend: skill.trend,
          salary: skill.salary,
          marketPercentile: calculatePercentile(skill.demand, allSkills)
        })
      } else {
        // Recommend high-demand skills they don't have
        if (skill.demand >= 80) {
          recommendedSkills.push({
            skill: skill.skill,
            demand: skill.demand,
            trend: skill.trend,
            reason: `High demand (${skill.demand}/100) and trending ${skill.trend}`,
            salary: skill.salary
          })
        }
      }
    })

    res.status(200).json({
      success: true,
      data: {
        userSkills: userSkillsData.sort((a, b) => b.demand - a.demand),
        recommendedSkills: recommendedSkills.slice(0, 5),
        marketOverview: {
          topSkill: allSkills[0],
          fastestGrowing: allSkills.filter(s => s.trend === 'rising').slice(0, 3),
          averageDemand: Math.round(allSkills.reduce((sum, s) => sum + s.demand, 0) / allSkills.length)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// Get detailed skill info
const getSkillDetails = async (req, res, next) => {
  try {
    const { skillName } = req.params

    const skill = await MarketData.findOne({ 
      skill: skillName.toLowerCase() 
    })

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      })
    }

    res.status(200).json({
      success: true,
      data: skill
    })
  } catch (error) {
    next(error)
  }
}

const calculatePercentile = (demand, allSkills) => {
  const below = allSkills.filter(s => s.demand < demand).length
  return Math.round((below / allSkills.length) * 100)
}

module.exports = { getAllSkills, getUserMarketAnalysis, getSkillDetails }