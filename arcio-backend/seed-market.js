const mongoose = require('mongoose')
const MarketData = require('./src/models/marketData.model')
require('dotenv').config()

/**
 * Seed real Indian market data into MongoDB as fallback
 * Salaries in ₹ LPA (Lakhs Per Annum) — based on Glassdoor India, AmbitionBox 2025-2026
 */
const marketSeeds = [
  {
    skill: 'ai/ml',
    demand: 96,
    trend: 'rising',
    salary: { min: 1200000, max: 5500000, average: 2800000, currency: 'INR' },
    jobCount: { linkedin: 28000, indeed: 20200, total: 48200 },
    relatedSkills: ['python', 'pytorch', 'tensorflow', 'data-science'],
    categoryTags: ['Data & AI', 'Backend'],
    description: 'Machine Learning and Artificial Intelligence roles across India. Highest growth sector in Indian tech.'
  },
  {
    skill: 'python',
    demand: 95,
    trend: 'rising',
    salary: { min: 600000, max: 4000000, average: 1800000, currency: 'INR' },
    jobCount: { linkedin: 35000, indeed: 27500, total: 62500 },
    relatedSkills: ['django', 'fastapi', 'data-science', 'ai/ml'],
    categoryTags: ['Backend', 'Data & AI'],
    description: 'Python remains the most versatile language in India, powering backend, AI/ML, and automation.'
  },
  {
    skill: 'typescript',
    demand: 92,
    trend: 'rising',
    salary: { min: 800000, max: 3500000, average: 1600000, currency: 'INR' },
    jobCount: { linkedin: 22000, indeed: 16400, total: 38400 },
    relatedSkills: ['react', 'next.js', 'node.js', 'angular'],
    categoryTags: ['Full-stack', 'Frontend'],
    description: 'TypeScript adoption surging across Indian startups. Standard for new React/Next.js projects.'
  },
  {
    skill: 'react',
    demand: 90,
    trend: 'rising',
    salary: { min: 700000, max: 3200000, average: 1500000, currency: 'INR' },
    jobCount: { linkedin: 26000, indeed: 19100, total: 45100 },
    relatedSkills: ['typescript', 'next.js', 'redux', 'tailwind'],
    categoryTags: ['Frontend'],
    description: 'React and Next.js dominate Indian frontend market. High demand from Swiggy, Zomato, Paytm.'
  },
  {
    skill: 'devops',
    demand: 88,
    trend: 'rising',
    salary: { min: 1000000, max: 4200000, average: 2200000, currency: 'INR' },
    jobCount: { linkedin: 20000, indeed: 14700, total: 34700 },
    relatedSkills: ['kubernetes', 'docker', 'aws', 'terraform'],
    categoryTags: ['Infrastructure', 'DevOps'],
    description: 'DevOps and Cloud engineering roles growing fast. Kubernetes expertise commands premium salaries.'
  },
  {
    skill: 'java',
    demand: 85,
    trend: 'stable',
    salary: { min: 500000, max: 3000000, average: 1400000, currency: 'INR' },
    jobCount: { linkedin: 42000, indeed: 30000, total: 72000 },
    relatedSkills: ['spring-boot', 'microservices', 'kotlin'],
    categoryTags: ['Backend'],
    description: 'Java remains backbone of Indian enterprise IT. Stable demand from TCS, Infosys, HCL, Cognizant.'
  },
  {
    skill: 'node.js',
    demand: 82,
    trend: 'rising',
    salary: { min: 600000, max: 2800000, average: 1400000, currency: 'INR' },
    jobCount: { linkedin: 17000, indeed: 12800, total: 29800 },
    relatedSkills: ['express', 'typescript', 'mongodb', 'graphql'],
    categoryTags: ['Backend'],
    description: 'Node.js powers Indian startup backends. Strong demand from Walmart Labs, Freshworks, Urban Company.'
  },
  {
    skill: 'go',
    demand: 78,
    trend: 'rising',
    salary: { min: 1200000, max: 4500000, average: 2400000, currency: 'INR' },
    jobCount: { linkedin: 7000, indeed: 5400, total: 12400 },
    relatedSkills: ['kubernetes', 'microservices', 'grpc'],
    categoryTags: ['Backend', 'Infrastructure'],
    description: 'Go adoption rising in Indian fintech and infrastructure. Zerodha, Dream11, Google India hiring actively.'
  },
  {
    skill: 'rust',
    demand: 72,
    trend: 'rising',
    salary: { min: 1500000, max: 5000000, average: 2800000, currency: 'INR' },
    jobCount: { linkedin: 2200, indeed: 1600, total: 3800 },
    relatedSkills: ['webassembly', 'systems-programming', 'c++'],
    categoryTags: ['Systems'],
    description: 'Rust is the fastest-growing systems language in India. Low volume but highest salary ceiling.'
  },
  {
    skill: 'c++',
    demand: 70,
    trend: 'stable',
    salary: { min: 800000, max: 3800000, average: 2000000, currency: 'INR' },
    jobCount: { linkedin: 12500, indeed: 9000, total: 21500 },
    relatedSkills: ['embedded', 'game-dev', 'systems-programming'],
    categoryTags: ['Systems'],
    description: 'C++ demand stable in India. Samsung R&D, Qualcomm, NVIDIA, Adobe India are top hirers.'
  },
  {
    skill: 'swift',
    demand: 55,
    trend: 'stable',
    salary: { min: 800000, max: 3000000, average: 1600000, currency: 'INR' },
    jobCount: { linkedin: 5000, indeed: 3900, total: 8900 },
    relatedSkills: ['ios', 'swiftui', 'objective-c'],
    categoryTags: ['Mobile'],
    description: 'Swift demand moderate in India. Apple India, Paytm, PhonePe are primary employers.'
  },
  {
    skill: 'php',
    demand: 45,
    trend: 'declining',
    salary: { min: 400000, max: 1800000, average: 900000, currency: 'INR' },
    jobCount: { linkedin: 10000, indeed: 8200, total: 18200 },
    relatedSkills: ['laravel', 'wordpress', 'mysql'],
    categoryTags: ['Backend'],
    description: 'PHP declining in India as startups migrate to TypeScript/Go. Legacy maintenance roles still available.'
  },
  {
    skill: 'ruby',
    demand: 38,
    trend: 'declining',
    salary: { min: 600000, max: 2500000, average: 1200000, currency: 'INR' },
    jobCount: { linkedin: 2500, indeed: 1700, total: 4200 },
    relatedSkills: ['rails', 'postgresql'],
    categoryTags: ['Backend'],
    description: 'Ruby/Rails demand shrinking in India. Niche roles at Shopify India and remote-first companies.'
  }
]

const seedMarket = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    await MarketData.deleteMany({})
    console.log('Cleared existing market data')

    const inserted = await MarketData.insertMany(marketSeeds)
    console.log(`✅ Seeded ${inserted.length} market data entries (Indian ₹ LPA)`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seedMarket()
