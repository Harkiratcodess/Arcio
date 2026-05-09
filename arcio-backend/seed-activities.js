const mongoose = require('mongoose')
const Activity = require('./src/models/activity.model')
require('dotenv').config()

const seedActivities = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to DB')

  const activities = [
    {
      userId: 'user_1',
      userName: 'haarkir Singh',
      type: 'analysis',
      repoName: 'quantum-engine-v2',
      repoFullName: 'haarkir/quantum-engine-v2',
      score: 88,
      timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 mins ago
    },
    {
      userId: 'user_2',
      userName: 'Harkirat',
      type: 'milestone',
      repoName: 'backend optimization',
      score: 50,
      timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },
    {
      userId: 'user_3',
      userName: 'Nobita',
      type: 'new_member',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
    }
  ]

  await Activity.deleteMany({})
  await Activity.insertMany(activities)
  console.log('Seeded activities')
  process.exit(0)
}

seedActivities()
