const mongoose = require('mongoose')

const marketDataSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  demand: {
    type: Number,
    min: 1,
    max: 100,
    required: true
  },
  trend: {
    type: String,
    enum: ['rising', 'stable', 'declining'],
    default: 'stable'
  },
  salary: {
    min: Number,
    max: Number,
    average: Number,
    currency: String
  },
  jobCount: {
    linkedin: Number,
    indeed: Number,
    total: Number
  },
  relatedSkills: [String],
  categoryTags: [String], // ['Frontend', 'Backend', 'Data', 'DevOps']
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('MarketData', marketDataSchema)