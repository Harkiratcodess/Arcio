const { clerkClient } = require('@clerk/clerk-sdk-node')
const logger = require('../utils/logger')

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      })
    }

    const payload = await clerkClient.verifyToken(token)
    req.userId = payload.sub
    next()
  } catch (error) {
    logger.error(`Auth failed: ${error.message}`)
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    })
  }
}

module.exports = { requireAuth }