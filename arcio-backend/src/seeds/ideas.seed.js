const mongoose = require('mongoose')
const Idea = require('../models/ideas.model')
require('dotenv').config()

const sampleIdeas = [
  {
    title: 'MERN Todo App with Real-time Sync',
    description: 'Build a collaborative todo application where multiple users can see updates in real-time. Learn WebSockets, state management, and database design.',
    difficulty: 'Beginner',
    timeToComplete: '1 week',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    source: 'github',
    importanceScore: 8,
    categoryTags: ['Real-time', 'Web App', 'Beginner-friendly'],
    skillsTaught: ['WebSockets', 'State management', 'Database design', 'Authentication']
  },
  {
    title: 'Next.js SaaS Boilerplate',
    description: 'Create a reusable SaaS starter template with authentication, payments (Stripe), and multi-tenant support. Deploy and use for your own projects.',
    difficulty: 'Advanced',
    timeToComplete: '3 weeks',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'PostgreSQL'],
    source: 'producthunt',
    importanceScore: 9,
    categoryTags: ['SaaS', 'Template', 'Full-stack'],
    skillsTaught: ['Next.js', 'Payment integration', 'Multi-tenancy', 'Deployment']
  },
  {
    title: 'GitHub Profile Analyzer',
    description: 'Analyze GitHub profiles to extract stats, show contribution graphs, and generate reports. Like what you\'re building with Arcio!',
    difficulty: 'Intermediate',
    timeToComplete: '2 weeks',
    stack: ['React', 'Node.js', 'GitHub API', 'Chart.js'],
    source: 'github',
    importanceScore: 7,
    categoryTags: ['Data viz', 'API integration', 'Portfolio project'],
    skillsTaught: ['REST APIs', 'Data visualization', 'Caching strategies']
  },
  {
    title: 'Expense Tracker with AI Categorization',
    description: 'Build a personal finance app that automatically categorizes expenses using AI. Add budgets, reports, and export to CSV.',
    difficulty: 'Intermediate',
    timeToComplete: '2 weeks',
    stack: ['React', 'Node.js', 'MongoDB', 'AI/ML'],
    source: 'reddit',
    importanceScore: 6,
    categoryTags: ['Finance', 'AI', 'Full-stack'],
    skillsTaught: ['AI integration', 'Financial logic', 'Data export']
  },
  {
    title: 'Discord Bot for Community Management',
    description: 'Create a Discord bot that moderates, welcomes members, runs polls, and tracks statistics. Host it 24/7 on Railway.',
    difficulty: 'Beginner',
    timeToComplete: '1 week',
    stack: ['Node.js', 'discord.js', 'MongoDB'],
    source: 'hackernews',
    importanceScore: 5,
    categoryTags: ['API integration', 'Bot', 'Community'],
    skillsTaught: ['Event-driven programming', 'Message parsing', 'Hosting']
  },
  {
    title: 'Markdown Blog with SEO',
    description: 'Build a static blog generator that reads Markdown files and generates optimized HTML. Add dark mode, search, and social sharing.',
    difficulty: 'Intermediate',
    timeToComplete: '1.5 weeks',
    stack: ['Next.js', 'TypeScript', 'MDX'],
    source: 'devto',
    importanceScore: 7,
    categoryTags: ['Static site', 'SEO', 'Content'],
    skillsTaught: ['MDX parsing', 'SEO optimization', 'Static generation']
  },
  {
    title: 'Real-time Chat App with Video',
    description: 'Build a chat application with text messaging, file sharing, and video calls. Learn WebRTC and peer-to-peer communication.',
    difficulty: 'Advanced',
    timeToComplete: '3 weeks',
    stack: ['React', 'Node.js', 'WebRTC', 'Socket.io'],
    source: 'github',
    importanceScore: 8,
    categoryTags: ['Real-time', 'Communication', 'WebRTC'],
    skillsTaught: ['WebRTC', 'P2P networks', 'Stream handling']
  },
  {
    title: 'E-commerce Store with Inventory',
    description: 'Full e-commerce platform with products, cart, checkout, and admin dashboard for inventory management. Integrate Stripe for payments.',
    difficulty: 'Advanced',
    timeToComplete: '4 weeks',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    source: 'producthunt',
    importanceScore: 9,
    categoryTags: ['E-commerce', 'Full-stack', 'Business'],
    skillsTaught: ['Payment processing', 'Inventory systems', 'Admin dashboards']
  },
  {
    title: 'Code Snippet Manager (like Gist)',
    description: 'Build a tool to save, organize, and share code snippets with syntax highlighting, search, and tags. Add team collaboration.',
    difficulty: 'Beginner',
    timeToComplete: '1.5 weeks',
    stack: ['React', 'Node.js', 'MongoDB', 'Prism.js'],
    source: 'reddit',
    importanceScore: 6,
    categoryTags: ['Developer tool', 'Productivity', 'Useful'],
    skillsTaught: ['Code highlighting', 'Search algorithms', 'Sharing/permissions']
  },
  {
    title: 'AI-powered Email Assistant',
    description: 'Build an app that reads emails and suggests replies, summarizes threads, and prioritizes important messages using AI.',
    difficulty: 'Advanced',
    timeToComplete: '2.5 weeks',
    stack: ['React', 'Node.js', 'OpenAI API', 'Gmail API'],
    source: 'hackernews',
    importanceScore: 8,
    categoryTags: ['AI', 'Automation', 'Productivity'],
    skillsTaught: ['Email APIs', 'AI integration', 'NLP basics']
  },
  {
    title: 'Personal Knowledge Base (like Notion)',
    description: 'Create a note-taking app with rich text, inline code, databases, and cross-linking. Add full-text search and exports.',
    difficulty: 'Advanced',
    timeToComplete: '3.5 weeks',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Elasticsearch'],
    source: 'github',
    importanceScore: 9,
    categoryTags: ['Productivity', 'Database design', 'Advanced'],
    skillsTaught: ['Rich text editing', 'Full-text search', 'Complex queries']
  },
  {
    title: 'Fitness Tracker with Workouts',
    description: 'Build a mobile-friendly fitness app that logs workouts, tracks progress, and generates personalized recommendations based on AI.',
    difficulty: 'Intermediate',
    timeToComplete: '2 weeks',
    stack: ['React Native', 'Node.js', 'MongoDB'],
    source: 'devto',
    importanceScore: 6,
    categoryTags: ['Mobile', 'Health', 'AI'],
    skillsTaught: ['React Native', 'Health data handling', 'Notifications']
  }
]

const seedIdeas = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing ideas
    await Idea.deleteMany({})
    console.log('Cleared existing ideas')

    // Insert sample ideas
    const inserted = await Idea.insertMany(sampleIdeas)
    console.log(`✅ Seeded ${inserted.length} ideas`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seedIdeas()