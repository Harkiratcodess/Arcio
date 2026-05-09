const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: String,
  type: {
    type: String,
    enum: ['analysis', 'milestone', 'new_member'],
    required: true
  },
  repoName: String,
  repoFullName: String,
  score: Number,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Activity', activitySchema)
