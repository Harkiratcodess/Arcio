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
      description: (repo.description || '').substring(0, 150), // ✅ Trim description
      url: repo.html_url,
      source: 'github'
    }))
    logger.info(`GitHub: ${ideas.length} ideas fetched`)
    return ideas
  } catch (error) {
    logger.error(`GitHub fetch failed: ${error.message}`)
    return []
  }
}

// 2. HackerNews API Fetcher — Batched, not 50 parallel requests
async function fetchHackerNews() {
  try {
    logger.info('Fetching from HackerNews API...')
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    const storyIds = topStoriesRes.data.slice(0, 50)

    // ✅ FIX: Fetch in batches of 10 instead of 50 at once
    const stories = []
    for (let i = 0; i < storyIds.length; i += 10) {
      const batch = storyIds.slice(i, i + 10)
      const batchResults = await Promise.all(
        batch.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
      )
      stories.push(...batchResults.map(r => r.data))
    }

    const ideas = stories
      .filter(s => s && s.title && s.title.toLowerCase().includes('show hn:'))
      .map(s => ({
        title: s.title.replace(/show hn:\s*/i, ''),
        description: s.text ? s.text.substring(0, 150) : s.title, // ✅ Trim to 150
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: 'hackernews'
      }))

    logger.info(`HackerNews: ${ideas.length} ideas fetched`)
    return ideas
  } catch (error) {
    logger.error(`HackerNews fetch failed: ${error.message}`)
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
      description: (article.description || '').substring(0, 150), // ✅ Trim
      url: article.url,
      source: 'devto'
    }))
    logger.info(`dev.to: ${ideas.length} ideas fetched`)
    return ideas
  } catch (error) {
    logger.error(`dev.to fetch failed: ${error.message}`)
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
        description: $(el).find('content').text().substring(0, 150).replace(/<[^>]*>/g, ''), // ✅ Trim
        url: $(el).find('link').attr('href'),
        source: 'producthunt'
      })
    })
    logger.info(`ProductHunt: ${ideas.length} ideas fetched`)
    return ideas
  } catch (error) {
    logger.error(`ProductHunt fetch failed: ${error.message}`)
    return []
  }
}

// ✅ NEW: Slim down ideas before sending to AI to avoid token overflow
function slimIdeasForAI(ideas, limit = 30) {
  return ideas.slice(0, limit).map(idea => ({
    title: idea.title?.substring(0, 80),
    description: idea.description?.substring(0, 120),
    url: idea.url,
    source: idea.source
  }))
}

// Main Runner
async function runIdeaScraper() {
  let shouldDisconnect = false
  try {
    logger.info('Starting Arcio Ideas Scraper Pipeline...')

    if (mongoose.connection.readyState !== 1) {
      logger.info('Connecting to MongoDB...')
      await mongoose.connect(process.env.MONGODB_URI)
      shouldDisconnect = true
    }

    // Step 1: Fetch all sources
    const [githubIdeas, hnIdeas, devtoIdeas, phIdeas] = await Promise.all([
      fetchGitHubTrending(),
      fetchHackerNews(),
      fetchDevTo(),
      fetchProductHunt()
    ])

    const allRawIdeas = [...githubIdeas, ...hnIdeas, ...devtoIdeas, ...phIdeas]
    logger.info(`Total raw ideas collected: ${allRawIdeas.length}`)

    if (allRawIdeas.length === 0) {
      logger.warn('No ideas collected. Skipping enrichment.')
      return
    }

    // Step 2: AI Enrichment — slim payload, no comment inside template
    logger.info('Sending ideas to AI for enrichment...')

    // ✅ FIX: Slim the ideas first, comment is OUTSIDE the template literal
    const slimmedIdeas = slimIdeasForAI(allRawIdeas, 30)

    const aiPrompt = `You are an idea enrichment engine. Extract junior-friendly project ideas buildable in 1-4 weeks.

For each idea return:
- title (exact)
- description (2 sentences, what they'll learn)
- difficulty: Beginner | Intermediate | Advanced
- stack: array of tech names
- skillsTaught: array of 3-4 skills
- importanceScore: 1-10
- url (original)
- source (original)

Filter out enterprise tools, vague ideas, and huge popular projects.
Return ONLY a valid JSON array, no markdown, no explanation.

DATA:
${JSON.stringify(slimmedIdeas)}`
    // ✅ Comment is now correctly OUTSIDE the template string

    const aiResponse = await getAIResponse(aiPrompt)
    let enrichedIdeas = []

    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim()
      enrichedIdeas = JSON.parse(cleaned)
    } catch (err) {
      logger.error('Failed to parse AI response as JSON.')
      return
    }

    logger.info(`AI enriched: ${enrichedIdeas.length} ideas`)

    // Step 3: Deduplication & Save
    const existingIdeas = await Idea.find({}, { title: 1 })
    const existingTitles = new Set(existingIdeas.map(i => i.title.toLowerCase()))

    const newIdeas = enrichedIdeas.filter(
      idea => !existingTitles.has(idea.title.toLowerCase())
    )

    if (newIdeas.length > 0) {
      await Idea.insertMany(newIdeas)
      logger.info(`Saved ${newIdeas.length} new ideas to database`)
    } else {
      logger.info('No new unique ideas to save.')
    }

    logger.info('Ideas scraper job completed successfully')
    return { success: true, count: newIdeas.length }

  } catch (error) {
    logger.error(`Scraper Pipeline Error: ${error.message}`)
    throw error
  } finally {
    if (shouldDisconnect) {
      await mongoose.disconnect()
      logger.info('MongoDB disconnected after standalone run')
    }
  }
}

if (require.main === module) {
  runIdeaScraper()
}

module.exports = { runIdeaScraper }