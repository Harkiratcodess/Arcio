require('dotenv').config()
const axios = require('axios')
const cheerio = require('cheerio')
const mongoose = require('mongoose')
const Idea = require('../models/ideas.model')
const { getAIResponse } = require('../config/ai')
const logger = require('../utils/logger')

// 1. GitHub API Fetcher
async function fetchGitHubTrending() {
  try {
    logger.info('Fetching from GitHub API...')
    const url = 'https://api.github.com/search/repositories?q=language:javascript+stars:>5000+created:>2024-01-01&sort=stars&per_page=30'
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Arcio-Scraper' }
    })
    
    const ideas = data.items.map(repo => ({
      title: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      source: 'github'
    }))
    
    logger.info(`✅ GitHub: ${ideas.length} ideas`)
    return ideas
  } catch (error) {
    logger.error(`❌ GitHub fetch failed: ${error.message}`)
    return []
  }
}

// 2. HackerNews API Fetcher
async function fetchHackerNews() {
  try {
    logger.info('Fetching from HackerNews API...')
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    const storyIds = topStoriesRes.data.slice(0, 50)
    
    const storyPromises = storyIds.map(id => 
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    )
    
    const stories = await Promise.all(storyPromises)
    const ideas = stories
      .map(s => s.data)
      .filter(s => s && s.title && s.title.toLowerCase().includes('show hn:'))
      .map(s => ({
        title: s.title.replace(/show hn:\s*/i, ''),
        description: s.text ? s.text.substring(0, 300) : s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: 'hackernews'
      }))
    
    logger.info(`✅ HackerNews: ${ideas.length} ideas`)
    return ideas
  } catch (error) {
    logger.error(`❌ HackerNews fetch failed: ${error.message}`)
    return []
  }
}

// 3. dev.to API Fetcher
async function fetchDevTo() {
  try {
    logger.info('Fetching from dev.to API...')
    const url = 'https://dev.to/api/articles?tag=showdev&sort_by=recent_comments&per_page=30'
    const { data } = await axios.get(url)
    
    const ideas = data.map(article => ({
      title: article.title,
      description: article.description || '',
      url: article.url,
      source: 'devto'
    }))
    
    logger.info(`✅ dev.to: ${ideas.length} ideas`)
    return ideas
  } catch (error) {
    logger.error(`❌ dev.to fetch failed: ${error.message}`)
    return []
  }
}

// 4. ProductHunt RSS Fetcher
async function fetchProductHunt() {
  try {
    logger.info('Fetching from ProductHunt RSS...')
    const { data } = await axios.get('https://www.producthunt.com/feed')
    const $ = cheerio.load(data, { xmlMode: true })
    const ideas = []
    
    $('entry').each((i, el) => {
      if (i >= 20) return
      ideas.push({
        title: $(el).find('title').text(),
        description: $(el).find('content').text().substring(0, 300).replace(/<[^>]*>/g, ''),
        url: $(el).find('link').attr('href'),
        source: 'producthunt'
      })
    })
    
    logger.info(`✅ ProductHunt: ${ideas.length} ideas`)
    return ideas
  } catch (error) {
    logger.error(`❌ ProductHunt fetch failed: ${error.message}`)
    return []
  }
}

// Main Runner
async function runIdeaScraper() {
  try {
    logger.info('Starting Arcio Ideas Scraper Pipeline...')
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Step 1: Parallel fetch all sources
    const [githubIdeas, hnIdeas, devtoIdeas, phIdeas] = await Promise.all([
      fetchGitHubTrending(),
      fetchHackerNews(),
      fetchDevTo(),
      fetchProductHunt()
    ])
    
    const allRawIdeas = [...githubIdeas, ...hnIdeas, ...devtoIdeas, ...phIdeas]
    logger.info(`Total raw ideas collected: ${allRawIdeas.length}`)
    
    if (allRawIdeas.length === 0) {
      logger.warn('No ideas collected from any source. Exiting.')
      return
    }

    // Step 2: AI Enrichment (Filter & Extract)
    logger.info('Sending ideas to AI for enrichment and filtering...')
    const aiPrompt = `I have project ideas from GitHub, ProductHunt, HackerNews, and dev.to.
Extract junior-friendly ideas that can be built in 1-4 weeks.

For each idea:
- Extract exact title
- Write 2-sentence description of what they'll learn
- Set difficulty: Beginner|Intermediate|Advanced
- List tech stack (comma separated)
- List 3-4 skills they'll gain (comma separated)
- Score importance 1-10 (how trendy/useful)
- Keep the original URL and source

Filter out enterprise tools, vague ideas, and already massive popular projects like React itself.

Return ONLY a JSON array in this format:
[
  {
    "title": "...",
    "description": "...",
    "difficulty": "...",
    "stack": ["...", "..."],
    "skillsTaught": ["...", "..."],
    "importanceScore": 8,
    "url": "...",
    "source": "..."
  }
]

DATA:
${JSON.stringify(allRawIdeas.slice(0, 50))} // Sending first 50 to avoid token limits`

    const aiResponse = await getAIResponse(aiPrompt)
    let enrichedIdeas = []
    
    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim()
      enrichedIdeas = JSON.parse(cleaned)
    } catch (err) {
      logger.error('Failed to parse AI response. Raw response was logged.')
      // logger.debug(aiResponse)
      return
    }

    logger.info(`✅ AI enriched: ${enrichedIdeas.length} ideas`)

    // Step 3: Deduplication & Save
    const existingIdeas = await Idea.find({}, { title: 1 })
    const existingTitles = new Set(existingIdeas.map(i => i.title.toLowerCase()))
    
    const newIdeas = enrichedIdeas.filter(idea => {
      const isNew = !existingTitles.has(idea.title.toLowerCase())
      return isNew
    })

    if (newIdeas.length > 0) {
      await Idea.insertMany(newIdeas)
      logger.info(`✅ Saved ${newIdeas.length} new ideas to database`)
    } else {
      logger.info('No new unique ideas to save.')
    }

    logger.info('Ideas scraper job completed successfully 🚀')
  } catch (error) {
    logger.error(`Scraper Pipeline Error: ${error.message}`)
  } finally {
    await mongoose.disconnect()
  }
}

if (require.main === module) {
  runIdeaScraper()
}

module.exports = { runIdeaScraper }
