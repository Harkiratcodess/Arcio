const axios = require('axios')
const logger = require('../utils/logger')

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

/**
 * Indian Salary Benchmarks (₹ LPA) — curated baseline
 * No free API exists for Indian salary data, so these are from:
 * Glassdoor India, AmbitionBox, Levels.fyi India (2025-2026)
 * These serve as the base; GitHub API provides LIVE trend data on top
 */
const SALARY_BENCHMARKS = {
  'TypeScript': { min: 8, max: 35, currency: 'INR' },
  'Python':     { min: 6, max: 40, currency: 'INR' },
  'JavaScript': { min: 5, max: 28, currency: 'INR' },
  'Rust':       { min: 15, max: 50, currency: 'INR' },
  'Go':         { min: 12, max: 45, currency: 'INR' },
  'Java':       { min: 5, max: 30, currency: 'INR' },
  'C++':        { min: 8, max: 38, currency: 'INR' },
  'Kotlin':     { min: 8, max: 32, currency: 'INR' },
  'Swift':      { min: 8, max: 30, currency: 'INR' },
  'PHP':        { min: 4, max: 18, currency: 'INR' },
  'Ruby':       { min: 6, max: 25, currency: 'INR' },
  'Dart':       { min: 6, max: 22, currency: 'INR' },
}

// Category mapping for skills
const CATEGORY_MAP = {
  'TypeScript': 'Full-stack',
  'Python':     'Backend & AI',
  'JavaScript': 'Full-stack',
  'Rust':       'Systems',
  'Go':         'Backend',
  'Java':       'Enterprise',
  'C++':        'Systems',
  'Kotlin':     'Mobile & Backend',
  'Swift':      'Mobile',
  'PHP':        'Backend',
  'Ruby':       'Backend',
  'Dart':       'Mobile',
}

/**
 * Fetch LIVE market trends using GitHub API
 * - Total repos → proxy for "demand" (normalized 0-100)
 * - Recent repos (last 7 days) → actual trend growth
 * - Combines with curated Indian salary benchmarks
 */
const fetchMarketTrends = async () => {
  const languages = ['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'JavaScript', 'Dart']
  const results = []

  for (const lang of languages) {
    try {
      const headers = GITHUB_TOKEN 
        ? { Authorization: `token ${GITHUB_TOKEN}`, 'User-Agent': 'Arcio-Market' }
        : { 'User-Agent': 'Arcio-Market' }

      // Live: total repo count for this language
      const volumeRes = await axios.get(
        `https://api.github.com/search/repositories?q=language:${lang}&per_page=1`,
        { headers }
      )
      const totalRepos = volumeRes.data.total_count

      // Live: repos created in last 7 days (growth indicator)
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      const dateStr = lastWeek.toISOString().split('T')[0]

      const trendRes = await axios.get(
        `https://api.github.com/search/repositories?q=language:${lang}+created:>${dateStr}&per_page=1`,
        { headers }
      )
      const recentRepos = trendRes.data.total_count

      // Live: repos created 2 weeks ago (for comparison — % change)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      const prevWeekStart = twoWeeksAgo.toISOString().split('T')[0]

      const prevRes = await axios.get(
        `https://api.github.com/search/repositories?q=language:${lang}+created:>${prevWeekStart}+created:<${dateStr}&per_page=1`,
        { headers }
      )
      const prevWeekRepos = prevRes.data.total_count

      // Calculate real trend percentage (week-over-week change)
      let trendPercent = 0
      if (prevWeekRepos > 0) {
        trendPercent = Math.round(((recentRepos - prevWeekRepos) / prevWeekRepos) * 100)
      }

      // Determine trend direction
      let trend = 'stable'
      if (trendPercent > 5) trend = 'rising'
      else if (trendPercent < -5) trend = 'declining'

      // Calculate demand score (0-100) — normalized by known max (JavaScript ~20M repos)
      const demandScore = Math.min(100, Math.round((totalRepos / 200000) * 10))

      // Indian salary from curated benchmarks
      const salaryData = SALARY_BENCHMARKS[lang] || { min: 5, max: 20, currency: 'INR' }

      results.push({
        skill: lang,
        demand: demandScore > 100 ? 100 : demandScore < 10 ? Math.max(demandScore, 25) : demandScore,
        trend,
        trendPercent,
        salary: `₹${salaryData.min}L – ₹${salaryData.max}L`,
        jobVolume: totalRepos,
        recentGrowth: recentRepos,
        category: CATEGORY_MAP[lang] || 'General',
        liveData: true
      })

      // Small delay to respect GitHub rate limits
      await new Promise(r => setTimeout(r, 300))

    } catch (error) {
      logger.warn(`GitHub API failed for ${lang}: ${error.message}`)
      // Fallback for this specific language
      const salaryData = SALARY_BENCHMARKS[lang] || { min: 5, max: 20, currency: 'INR' }
      results.push({
        skill: lang,
        demand: 50,
        trend: 'stable',
        trendPercent: 0,
        salary: `₹${salaryData.min}L – ₹${salaryData.max}L`,
        jobVolume: 0,
        recentGrowth: 0,
        category: CATEGORY_MAP[lang] || 'General',
        liveData: false
      })
    }
  }

  // Sort by demand descending
  results.sort((a, b) => b.demand - a.demand)

  logger.info(`Market trends fetched: ${results.filter(r => r.liveData).length}/${results.length} live`)
  return results
}

/**
 * Fetch LIVE tech news from HackerNews + Dev.to APIs (free, no key needed)
 * Returns real headlines relevant to developers
 */
const fetchMarketNews = async () => {
  const allNews = []

  // 1. HackerNews top stories — real headlines
  try {
    const topRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json')
    const storyIds = topRes.data.slice(0, 15)

    const stories = await Promise.all(
      storyIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`))
    )

    stories
      .map(s => s.data)
      .filter(s => s && s.title && s.score > 50)
      .forEach(s => {
        // Detect related skills from title
        const relatedSkills = detectSkills(s.title)
        allNews.push({
          id: `hn_${s.id}`,
          headline: s.title,
          source: 'Hacker News',
          category: categorizeNews(s.title),
          impact: s.score > 200 ? 'bullish' : 'neutral',
          relatedSkills,
          timestamp: new Date(s.time * 1000).toISOString(),
          summary: `Trending on HN with ${s.score} points and ${s.descendants || 0} comments.`,
          url: s.url || `https://news.ycombinator.com/item?id=${s.id}`
        })
      })

    logger.info(`HackerNews: ${allNews.length} news items fetched`)
  } catch (error) {
    logger.warn(`HackerNews news fetch failed: ${error.message}`)
  }

  // 2. Dev.to trending articles — real tech articles
  try {
    const devtoRes = await axios.get('https://dev.to/api/articles?per_page=10&top=1')
    const articles = devtoRes.data

    articles.forEach(article => {
      const relatedSkills = detectSkills(article.title + ' ' + (article.tag_list || []).join(' '))
      allNews.push({
        id: `devto_${article.id}`,
        headline: article.title,
        source: 'Dev.to',
        category: categorizeNews(article.title),
        impact: article.positive_reactions_count > 100 ? 'bullish' : 'neutral',
        relatedSkills,
        timestamp: article.published_at,
        summary: article.description || `${article.positive_reactions_count} reactions from the dev community.`,
        url: article.url
      })
    })

    logger.info(`Dev.to: ${articles.length} news items fetched`)
  } catch (error) {
    logger.warn(`Dev.to news fetch failed: ${error.message}`)
  }

  // Sort by timestamp (most recent first)
  allNews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  return allNews.slice(0, 12) // Return top 12
}

/**
 * Detect programming skills mentioned in a title/text
 */
const detectSkills = (text) => {
  const skillKeywords = {
    'rust': 'Rust', 'python': 'Python', 'typescript': 'TypeScript',
    'javascript': 'JavaScript', 'go ': 'Go', 'golang': 'Go',
    'java ': 'Java', 'kotlin': 'Kotlin', 'swift': 'Swift',
    'react': 'React', 'next.js': 'Next.js', 'nextjs': 'Next.js',
    'node': 'Node.js', 'docker': 'DevOps', 'kubernetes': 'DevOps',
    'k8s': 'DevOps', 'aws': 'Cloud', 'gcp': 'Cloud',
    'ai ': 'AI/ML', 'ml ': 'AI/ML', 'llm': 'AI/ML', 'gpt': 'AI/ML',
    'machine learning': 'AI/ML', 'deep learning': 'AI/ML',
    'php': 'PHP', 'ruby': 'Ruby', 'rails': 'Ruby',
    'c++': 'C++', 'cpp': 'C++', 'wasm': 'WebAssembly',
    'flutter': 'Dart', 'dart': 'Dart'
  }

  const lower = text.toLowerCase()
  const found = new Set()
  for (const [keyword, skill] of Object.entries(skillKeywords)) {
    if (lower.includes(keyword)) found.add(skill)
  }
  return Array.from(found).slice(0, 3)
}

/**
 * Categorize news headline
 */
const categorizeNews = (title) => {
  const lower = title.toLowerCase()
  if (lower.includes('hire') || lower.includes('job') || lower.includes('career')) return 'Hiring'
  if (lower.includes('fund') || lower.includes('raise') || lower.includes('valuation') || lower.includes('ipo')) return 'Funding'
  if (lower.includes('open source') || lower.includes('github') || lower.includes('release')) return 'Open Source'
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('gpt') || lower.includes('llm')) return 'AI & ML'
  if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('hack')) return 'Security'
  if (lower.includes('startup') || lower.includes('launch')) return 'Startups'
  return 'Tech'
}

module.exports = { fetchMarketTrends, fetchMarketNews }
