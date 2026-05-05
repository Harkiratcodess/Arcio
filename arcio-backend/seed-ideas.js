const mongoose = require('mongoose');
const Idea = require('./src/models/ideas.model');
require('dotenv').config();

const sampleIdeas = [
  {
    title: "AI-Powered SaaS Analyzer",
    description: "A professional dashboard that analyzes SaaS landing pages and gives conversion optimization tips using GPT-4.",
    difficulty: "Advanced",
    timeToComplete: "4 weeks",
    stack: ["React", "Node.js", "OpenAI", "Tailwind"],
    source: "producthunt",
    importanceScore: 9,
    categoryTags: ["AI", "SaaS", "Productivity"],
    skillsTaught: ["OpenAI API Integration", "Real-time Data Streaming", "Premium UI/UX Design"]
  },
  {
    title: "Real-time Collaborative Whiteboard",
    description: "A high-performance whiteboard for remote teams with infinite canvas, sticky notes, and real-time cursor tracking.",
    difficulty: "Intermediate",
    timeToComplete: "2 weeks",
    stack: ["React", "Socket.io", "Canvas API", "Redux"],
    source: "github",
    importanceScore: 8,
    categoryTags: ["WebSockets", "Collaboration"],
    skillsTaught: ["Socket.io", "State Management", "Canvas Optimization"]
  },
  {
    title: "Modern Personal Portfolio",
    description: "A minimal, typography-focused developer portfolio with smooth transitions and a projects gallery.",
    difficulty: "Beginner",
    timeToComplete: "1 week",
    stack: ["React", "Framer Motion", "CSS Modules"],
    source: "devto",
    importanceScore: 7,
    categoryTags: ["Portfolio", "Frontend"],
    skillsTaught: ["Animations", "Responsive Design", "Modern CSS"]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');
    
    await Idea.deleteMany({});
    console.log('Cleared existing ideas.');
    
    await Idea.insertMany(sampleIdeas);
    console.log('Seeded sample ideas successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
