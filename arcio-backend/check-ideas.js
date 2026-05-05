const mongoose = require('mongoose');
const Idea = require('./src/models/ideas.model');
require('dotenv').config();

async function checkIdeas() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Idea.countDocuments();
    const ideas = await Idea.find().limit(1);
    console.log(`Idea count: ${count}`);
    if (count > 0) {
      console.log('Sample idea:', ideas[0].title);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkIdeas();
