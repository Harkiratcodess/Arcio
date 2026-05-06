const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  repoUrl: {
    type: String,
    required: true
  },
  repoFullName: {
    type: String,
    required: true
  },
  scores: {
    overall: Number,
    codeQuality: Number,
    architecture: Number,
    readme: Number,
    naming: Number
  },
  improvements: [{
    title: String,
    description: String,
    difficulty: String,
    priority: String
  }],
  summary: String,
  analyzedAt: {
    type: Date,
    default: Date.now
  },
  public: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Index for leaderboard sorting
analysisSchema.index({ 'scores.overall': -1 })
analysisSchema.index({ public: 1 })

module.exports = mongoose.model('Analysis', analysisSchema)
