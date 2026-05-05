const mongoose = require('mongoose')

const ideasSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String, // 'Beginner', 'Intermediate', 'Advanced'
  timeToComplete: String, // '2 weeks', '1 month'
  stack: [String], // ['React', 'Node.js', 'MongoDB']
  source: String, // 'producthunt', 'github', 'reddit', 'hackernews', 'devto'
  url: String,
  importanceScore: Number, // 1-10, how trending
  categoryTags: [String], // ['AI', 'Web3', 'Productivity']
  skillsTaught: [String],
  createdAt: { type: Date, default: Date.now },
  refreshedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Idea', ideasSchema)
