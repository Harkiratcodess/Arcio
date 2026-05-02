const User = require('../models/user.model')
const { AppError } = require('../middleware/errorHandler')
const { setCache, getCache, deleteCache } = require('../utils/cache')
const logger = require('../utils/logger')


const syncUser = async (req, res, next) => {
  try {
    const { clerkId, name, email, avatar } = req.body

    const cached = await getCache(`user:${clerkId}`)
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached
      })
    }

    let user = await User.findOne({ clerkId })

    if (!user) {
      user = await User.create({
        clerkId,
        name,
        email,
        avatar
      })
      logger.info(`New user created: ${email}`)
    }

    await setCache(`user:${clerkId}`, user, 1800)

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const { userId } = req

    const cached = await getCache(`user:${userId}`)
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached
      })
    }

    const user = await User.findOne({ clerkId: userId })
    if (!user) {
      return next(new AppError('User not found', 404))
    }


    await setCache(`user:${userId}`, user, 1800)

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req
    const { techStack, experienceLevel, targetRole, githubUsername, bio } = req.body

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        profile: {
          techStack,
          experienceLevel,
          targetRole,
          githubUsername,
          bio
        }
      },
      { new: true }
    )

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    await deleteCache(`user:${userId}`)

    logger.info(`Profile updated: ${userId}`)

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { syncUser, getProfile, updateProfile }