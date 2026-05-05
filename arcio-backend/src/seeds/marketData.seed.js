const mongoose = require('mongoose')
const MarketData = require('../models/marketData.model')
require('dotenv').config()

const marketData = [
  {
    skill: 'React',
    demand: 95,
    trend: 'rising',
    salary: { min: 80000, max: 180000, average: 130000, currency: 'USD' },
    jobCount: { linkedin: 15234, indeed: 8932, total: 24166 },
    relatedSkills: ['JavaScript', 'TypeScript', 'Next.js', 'Redux'],
    categoryTags: ['Frontend', 'JavaScript'],
    description: 'Most in-demand frontend framework. Essential for modern web development.'
  },
  {
    skill: 'TypeScript',
    demand: 88,
    trend: 'rising',
    salary: { min: 85000, max: 190000, average: 137500, currency: 'USD' },
    jobCount: { linkedin: 12456, indeed: 7890, total: 20346 },
    relatedSkills: ['JavaScript', 'React', 'Node.js'],
    categoryTags: ['Language', 'Frontend', 'Backend'],
    description: 'Type safety for JavaScript. Career multiplier skill.'
  },
  {
    skill: 'Node.js',
    demand: 92,
    trend: 'stable',
    salary: { min: 82000, max: 175000, average: 128500, currency: 'USD' },
    jobCount: { linkedin: 14567, indeed: 9234, total: 23801 },
    relatedSkills: ['JavaScript', 'Express', 'MongoDB', 'PostgreSQL'],
    categoryTags: ['Backend', 'JavaScript'],
    description: 'JavaScript runtime for backend. Industry standard.'
  },
  {
    skill: 'Next.js',
    demand: 85,
    trend: 'rising',
    salary: { min: 90000, max: 200000, average: 145000, currency: 'USD' },
    jobCount: { linkedin: 8934, indeed: 5123, total: 14057 },
    relatedSkills: ['React', 'TypeScript', 'Vercel'],
    categoryTags: ['Frontend', 'Full-stack'],
    description: 'React meta-framework. Fastest growing framework.'
  },
  {
    skill: 'Python',
    demand: 87,
    trend: 'stable',
    salary: { min: 78000, max: 165000, average: 121500, currency: 'USD' },
    jobCount: { linkedin: 16234, indeed: 10567, total: 26801 },
    relatedSkills: ['Django', 'Flask', 'Data Science', 'Machine Learning'],
    categoryTags: ['Backend', 'Data', 'AI/ML'],
    description: 'Versatile language. Used in backend, data science, and AI.'
  },
  {
    skill: 'MongoDB',
    demand: 80,
    trend: 'stable',
    salary: { min: 75000, max: 160000, average: 117500, currency: 'USD' },
    jobCount: { linkedin: 9876, indeed: 6543, total: 16419 },
    relatedSkills: ['Node.js', 'Express', 'NoSQL'],
    categoryTags: ['Database', 'Backend'],
    description: 'NoSQL database. Popular for startups and MERN stack.'
  },
  {
    skill: 'PostgreSQL',
    demand: 84,
    trend: 'rising',
    salary: { min: 80000, max: 170000, average: 125000, currency: 'USD' },
    jobCount: { linkedin: 11234, indeed: 7654, total: 18888 },
    relatedSkills: ['SQL', 'Node.js', 'Python'],
    categoryTags: ['Database', 'Backend'],
    description: 'Relational database. Growing demand, more reliable than NoSQL.'
  },
  {
    skill: 'AWS',
    demand: 86,
    trend: 'rising',
    salary: { min: 95000, max: 210000, average: 152500, currency: 'USD' },
    jobCount: { linkedin: 13456, indeed: 8765, total: 22221 },
    relatedSkills: ['DevOps', 'Docker', 'CI/CD'],
    categoryTags: ['DevOps', 'Cloud'],
    description: 'Cloud platform leader. High-paying skill.'
  },
  {
    skill: 'Docker',
    demand: 82,
    trend: 'stable',
    salary: { min: 85000, max: 180000, average: 132500, currency: 'USD' },
    jobCount: { linkedin: 10234, indeed: 6789, total: 17023 },
    relatedSkills: ['Kubernetes', 'DevOps', 'AWS'],
    categoryTags: ['DevOps', 'Backend'],
    description: 'Containerization. Essential for modern deployment.'
  },
  {
    skill: 'JavaScript',
    demand: 93,
    trend: 'stable',
    salary: { min: 75000, max: 160000, average: 117500, currency: 'USD' },
    jobCount: { linkedin: 18934, indeed: 12456, total: 31390 },
    relatedSkills: ['React', 'Node.js', 'TypeScript'],
    categoryTags: ['Language', 'Frontend', 'Backend'],
    description: 'Most popular programming language. Foundation skill.'
  },
  {
    skill: 'Tailwind CSS',
    demand: 78,
    trend: 'rising',
    salary: { min: 70000, max: 150000, average: 110000, currency: 'USD' },
    jobCount: { linkedin: 6234, indeed: 3456, total: 9690 },
    relatedSkills: ['React', 'CSS', 'Web Design'],
    categoryTags: ['Frontend', 'CSS'],
    description: 'Utility-first CSS framework. Growing rapidly.'
  },
  {
    skill: 'Git',
    demand: 91,
    trend: 'stable',
    salary: { min: 0, max: 0, average: 0, currency: 'Baseline' },
    jobCount: { linkedin: 25000, indeed: 15000, total: 40000 },
    relatedSkills: ['GitHub', 'GitLab', 'DevOps'],
    categoryTags: ['Tools', 'Essential'],
    description: 'Version control. Non-negotiable skill for developers.'
  },
  {
    skill: 'Stripe',
    demand: 72,
    trend: 'rising',
    salary: { min: 80000, max: 170000, average: 125000, currency: 'USD' },
    jobCount: { linkedin: 5234, indeed: 2890, total: 8124 },
    relatedSkills: ['Payment processing', 'Node.js', 'React'],
    categoryTags: ['Backend', 'Business'],
    description: 'Payment integration. High-value skill for SaaS.'
  },
  {
    skill: 'Kubernetes',
    demand: 75,
    trend: 'rising',
    salary: { min: 100000, max: 220000, average: 160000, currency: 'USD' },
    jobCount: { linkedin: 7890, indeed: 4567, total: 12457 },
    relatedSkills: ['Docker', 'DevOps', 'AWS'],
    categoryTags: ['DevOps', 'Cloud'],
    description: 'Container orchestration. Advanced DevOps skill, premium pay.'
  }
]

const seedMarketData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await MarketData.deleteMany({})
    console.log('Cleared existing market data')

    const inserted = await MarketData.insertMany(marketData)
    console.log(`✅ Seeded ${inserted.length} skills`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seedMarketData()