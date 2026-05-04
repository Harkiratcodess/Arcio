const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },

  profile: {
    techStack: {
      type: [String], 
      default: []
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'junior', 'mid', 'senior'],
      default: 'junior'
    },
    targetRole: {
      type: String,
      default: ''
    },
    githubUsername: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    }
  },


  stats: {
    developerScore: {
      type: Number,
      default: 0
    },
    reposAnalyzed: {
      type: Number,
      default: 0
    },
    weeklyStreak: {
      type: Number,
      default: 0
    },
    percentileRank: {
      type: Number,
      default: 0
    },
    lastScoreChange: {
      type: Number,
      default: 0
    }
  },

  usage: {
    dailyAnalysisCount: {
      type: Number,
      default: 0
    },
    lastAnalysisDate: {
      type: Date,
      default: null
    }
  },


  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)