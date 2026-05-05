const { octokit } = require('../config/github')
const { getAIResponse } = require('../config/ai')
const { setCache, getCache } = require('../utils/cache')
const { AppError } = require('../middleware/errorHandler')
const { incrementUsage, PLAN_LIMITS } = require('../middleware/usageLimit')
const logger = require('../utils/logger')

const parseGitHubUrl = (url) => {
  try {
    let cleaned = url.trim().replace('https://github.com/', '').replace('http://github.com/', '').replace('github.com/', '')
    if (cleaned.endsWith('.git')) {
      cleaned = cleaned.slice(0, -4)
    }
    // Remove any trailing slashes
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1)
    }
    const parts = cleaned.split('/')
    return { owner: parts[0], repo: parts[1] }
  } catch {
    return null
  }
}

const fetchRepoData = async (owner, repo) => {
  const [repoInfo, readme, tree] = await Promise.allSettled([
    octokit.rest.repos.get({ owner, repo }),
    octokit.rest.repos.getContent({ owner, repo, path: 'README.md' }),
    octokit.rest.git.getTree({ owner, repo, tree_sha: 'HEAD', recursive: 'true' })
  ])

  const repoData = repoInfo.status === 'fulfilled' ? repoInfo.value.data : null
  if (!repoData) throw new AppError('Repository not found or is private', 404)

  let readmeContent = ''
  let readmeExists = false
  if (readme.status === 'fulfilled') {
    readmeContent = Buffer.from(readme.value.data.content, 'base64').toString('utf-8')
    readmeExists = true
  }

  let fileTree = []
  if (tree.status === 'fulfilled') {
    fileTree = tree.value.data.tree
      .filter(f => f.type === 'blob')
      .map(f => f.path)
  }

  return { repoData, readmeContent, readmeExists, fileTree }
}

// Fetch actual file content from GitHub
const fetchFileContent = async (owner, repo, path) => {
  try {
    const response = await octokit.rest.repos.getContent({ owner, repo, path })
    if (response.data.content) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8')
    }
    return null
  } catch (error) {
    logger.warn(`Failed to fetch file ${path}: ${error.message}`)
    return null
  }
}

// Identify which files to deep-analyze (excluding README)
const selectFilesForAnalysis = (fileTree, maxFiles) => {
  // Priority patterns - files most likely to have issues or be important
  const priorityPatterns = [
    // Entry points and configs — often have issues
    /^(index|main|app|server)\.(js|ts|tsx|jsx|py)$/i,
    /^(package|composer|Cargo|Gemfile|requirements)\.(json|toml|lock|txt)$/i,
    // Core source files
    /\.(js|ts|tsx|jsx|py|java|go|rs|rb|php|cs)$/i,
    // Config files people often misconfigure
    /\.(config|rc)\.(js|ts|json|yml|yaml)$/i,
    /^\.?(eslint|prettier|babel|webpack|vite|tsconfig)/i,
    // Docker and CI
    /^(Dockerfile|docker-compose|\.github\/workflows)/i,
  ]

  // Filter out non-code files, README, node_modules, lock files, etc.
  const codeFiles = fileTree.filter(f => {
    const lower = f.toLowerCase()
    if (lower.includes('node_modules/')) return false
    if (lower.includes('dist/')) return false
    if (lower.includes('.min.')) return false
    if (lower.endsWith('.lock')) return false
    if (lower.endsWith('.md') && lower.includes('readme')) return false
    if (lower.endsWith('.svg') || lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.ico') || lower.endsWith('.woff') || lower.endsWith('.woff2') || lower.endsWith('.ttf') || lower.endsWith('.pdf')) return false;
    if (lower.endsWith('.map') || lower.endsWith('.exe') || lower.endsWith('.bin') || lower.endsWith('.pyc')) return false;
    return true;
  })

  // Score each file by priority
  const scored = codeFiles.map(f => {
    let score = 0
    const filename = f.split('/').pop()
    
    // Root-level files are more important
    if (!f.includes('/')) score += 3
    
    // Entry points get high priority
    if (/^(index|main|app|server)\./i.test(filename)) score += 5
    
    // Source code files
    if (/\.(js|ts|tsx|jsx|py|java|go|rs)$/i.test(filename)) score += 2
    
    // Config files often have issues
    if (/\.(config|rc)\./i.test(filename) || /^\.?(eslint|prettier|tsconfig)/i.test(filename)) score += 3
    
    // Components, controllers, routes — important code
    if (f.includes('components/') || f.includes('controllers/') || f.includes('routes/')) score += 4
    
    // Test files are important but less priority for error finding
    if (f.includes('test') || f.includes('spec')) score += 1

    return { path: f, score }
  })

  // Sort by score descending and take top N
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxFiles).map(s => s.path)
}

const calculateProgrammaticScores = (repoData, readmeContent, readmeExists, fileTree) => {
  let readmeScore = 0
  if (readmeExists) {
    if (readmeContent.length > 0) readmeScore += 30
    if (readmeContent.length > 500) readmeScore += 20
    if (readmeContent.includes('##')) readmeScore += 15
    if (readmeContent.toLowerCase().includes('install')) readmeScore += 20
    if (readmeContent.toLowerCase().includes('usage')) readmeScore += 15
  }
  readmeScore = Math.min(readmeScore, 100)

  let architectureScore = 0
  const paths = fileTree.join(' ')
  if (paths.includes('src/')) architectureScore += 25
  if (paths.includes('components/')) architectureScore += 20
  if (paths.includes('utils/') || paths.includes('helpers/')) architectureScore += 15
  if (paths.includes('test') || paths.includes('spec')) architectureScore += 25
  if (fileTree.includes('.gitignore')) architectureScore += 15
  architectureScore = Math.min(architectureScore, 100)

  let namingScore = 70
  const hasGoodNames = fileTree.some(f =>
    f.match(/^[a-z][a-zA-Z0-9]*\.(js|ts|tsx|jsx)$/) ||
    f.match(/^[a-z-]+\.(js|ts|tsx|jsx)$/)
  )
  if (hasGoodNames) namingScore += 30
  namingScore = Math.min(namingScore, 100)

  // Structure health checks
  const structureIssues = []
  if (!readmeExists) structureIssues.push('README.md is missing')
  if (!fileTree.includes('.gitignore')) structureIssues.push('.gitignore is missing')
  if (!fileTree.some(f => f.includes('LICENSE'))) structureIssues.push('LICENSE file is missing')
  if (!fileTree.some(f => f.includes('test') || f.includes('spec') || f.includes('__tests__'))) {
    structureIssues.push('No test files found')
  }
  if (!fileTree.some(f => f.includes('.env.example') || f.includes('.env.sample'))) {
    structureIssues.push('.env.example is missing — others won\'t know what env vars are needed')
  }
  if (fileTree.some(f => f === '.env')) {
    structureIssues.push('.env file is committed — this is a security risk!')
  }
  if (!fileTree.some(f => /\.(config|rc)\./i.test(f.split('/').pop()) || /eslint|prettier/i.test(f))) {
    structureIssues.push('No linter/formatter config found')
  }

  return { readmeScore, architectureScore, namingScore, structureIssues }
}

const analyzeRepo = async (req, res, next) => {
  try {
    const { repoUrl } = req.body

    if (!repoUrl) {
      return next(new AppError('Repository URL is required', 400))
    }

    const parsed = parseGitHubUrl(repoUrl)
    if (!parsed) {
      return next(new AppError('Invalid GitHub URL', 400))
    }

    const { owner, repo } = parsed

    // Determine file limit based on plan
    const userPlan = req.userPlan || 'free'
    const planLimits = req.planLimits || PLAN_LIMITS.free
    const fileLimit = planLimits.fileAnalysisCount

    const cacheKey = `analysis:${owner}:${repo}:${userPlan}`

    const cached = await getCache(cacheKey)
    if (cached) {
      logger.info(`Cache hit for repo: ${owner}/${repo} (${userPlan})`)

      // Still increment usage even for cached results
      if (req.userDoc) {
        await incrementUsage(req.userDoc, req.isNewDay)
      }

      return res.status(200).json({ 
        success: true, 
        data: cached, 
        cached: true,
        usage: {
          plan: userPlan,
          used: (req.currentUsage || 0) + 1,
          limit: planLimits.dailyAnalyses,
          filesAnalyzed: fileLimit
        }
      })
    }

    logger.info(`Analyzing repo: ${owner}/${repo} (${userPlan} plan, ${fileLimit} files)`)

    const { repoData, readmeContent, readmeExists, fileTree } = await fetchRepoData(owner, repo)

    const { readmeScore, architectureScore, namingScore, structureIssues } = calculateProgrammaticScores(
      repoData, readmeContent, readmeExists, fileTree
    )

    // === DEEP FILE ANALYSIS ===
    // Select files to analyze (fileLimit - 1, since README is always first)
    const filesToAnalyze = selectFilesForAnalysis(fileTree, fileLimit - 1)
    
    // Always analyze README first (if it exists), then the selected files
    const allFilesToAnalyze = readmeExists ? ['README.md', ...filesToAnalyze] : filesToAnalyze
    
    // Fetch file contents in parallel (limit concurrency)
    const fileContents = []
    const batchSize = 5
    for (let i = 0; i < allFilesToAnalyze.length; i += batchSize) {
      const batch = allFilesToAnalyze.slice(i, i + batchSize)
      const contents = await Promise.all(
        batch.map(async (path) => {
          const content = await fetchFileContent(owner, repo, path)
          if (!content) return null
          
          // Basic binary check: check for null bytes or excessive non-printable chars
          const isBinary = /[\x00-\x08\x0E-\x1F]/.test(content.slice(0, 1000))
          if (isBinary) return null

          // Strip non-printable characters to be safe
          const cleaned = content.replace(/[\x00-\x08\x0E-\x1F\x7F-\x9F]/g, '')
          return { path, content: cleaned.slice(0, 2500) }
        })
      )
      fileContents.push(...contents.filter(f => f !== null))
    }

    // Build file analysis section for AI prompt
    const fileAnalysisSection = fileContents.map(f => 
      `--- FILE: ${f.path} ---\n${f.content}\n--- END FILE ---`
    ).join('\n\n')

    // Enhanced AI prompt with deep file analysis
    const aiPrompt = `You are a senior developer reviewing a GitHub repository for portfolio quality. Provide a THOROUGH code review.

Repository: ${owner}/${repo}
Language: ${repoData.language || 'Unknown'}
Stars: ${repoData.stargazers_count}
Description: ${repoData.description || 'No description'}
Full file tree (${fileTree.length} files): ${fileTree.slice(0, 60).join(', ')}

STRUCTURE ISSUES FOUND:
${structureIssues.length > 0 ? structureIssues.map(i => `- ${i}`).join('\n') : '- No major structural issues'}

FILES ANALYZED (${fileContents.length} files):
${fileAnalysisSection}

Please provide:
1. A code quality score out of 100
2. A detailed summary of the repository (1-2 paragraphs)
3. Exactly 3 specific improvement suggestions
4. For EACH analyzed file, provide specific feedback with issues found and suggestions

Respond ONLY in this exact JSON format, no other text.
**CRITICAL:** The "summary" must be a natural language explanation for a human. Do NOT include file markers, code blocks, or raw data in the summary.
{
  "codeQualityScore": 75,
  "summary": "One paragraph honest summary of the repo quality, what's good and what needs work. Focus on high-level architecture and patterns.",
  "improvements": [
    {
      "title": "Clear title of improvement",
      "description": "Specific, actionable description with WHY it matters",
      "difficulty": "Quick Fix | Medium | High Effort",
      "priority": "Critical | Important | Nice to Have"
    }
  ],
  "fileReviews": [
    {
      "path": "filename.js",
      "score": 75,
      "issues": ["Issue 1 found in this file", "Issue 2"],
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "severity": "good | needs-work | critical"
    }
  ]
}`

    const aiResponse = await getAIResponse(aiPrompt)

    let aiData
    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim()
      aiData = JSON.parse(cleaned)
    } catch {
      aiData = {
        codeQualityScore: 70,
        improvements: [],
        summary: aiResponse,
        fileReviews: []
      }
    }

  
    const overallScore = Math.round(
      (aiData.codeQualityScore * 0.30) +
      (architectureScore * 0.25) +
      (readmeScore * 0.25) +
      (namingScore * 0.20)
    )

    const result = {
      repo: {
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        url: repoData.html_url,
        updatedAt: repoData.updated_at
      },
      scores: {
        overall: overallScore,
        codeQuality: aiData.codeQualityScore,
        architecture: architectureScore,
        readme: readmeScore,
        naming: namingScore
      },
      structureIssues,
      improvements: aiData.improvements,
      fileReviews: aiData.fileReviews || [],
      filesAnalyzed: allFilesToAnalyze.length,
      summary: aiData.summary,
      planUsed: userPlan,
      analyzedAt: new Date().toISOString()
    }

    await setCache(cacheKey, result, 3600)

    // Increment usage count
    if (req.userDoc) {
      await incrementUsage(req.userDoc, req.isNewDay)
    }

    logger.info(`Analysis complete for ${owner}/${repo} — score: ${overallScore}, files: ${allFilesToAnalyze.length}`)

    res.status(200).json({ 
      success: true, 
      data: result,
      usage: {
        plan: userPlan,
        used: (req.currentUsage || 0) + 1,
        limit: planLimits.dailyAnalyses,
        filesAnalyzed: allFilesToAnalyze.length
      }
    })

  } catch (error) {
    next(error)
  }
}

const chatAboutRepo = async (req, res, next) => {
  try {
    const { message, repoContext } = req.body

    if (!message) {
      return next(new AppError('Message is required', 400))
    }

    const systemPrompt = `You are Arcio AI, a senior code review assistant helping developers improve their GitHub portfolios.

Current repo being discussed: ${repoContext?.repo?.fullName || 'unknown'}
Overall score: ${repoContext?.scores?.overall || 'unknown'}/100
Key issues: ${repoContext?.improvements?.map(i => i.title).join(', ') || 'none'}

Rules you always follow:
- Never write full code for the user
- Give file structure suggestions, not implementations  
- Max 4-5 lines of example code only when absolutely necessary
- Keep responses short, conversational, direct — like a senior dev
- Stay focused on the repo being analyzed
- Explain WHY improvements matter to recruiters
- If asked unrelated things, bring them back to the repo
- CRITICAL: Do NOT use any emojis. Zero emojis allowed.
- Maintain a highly professional, analytical tone at all times.

User message: ${message}`

    const response = await getAIResponse(systemPrompt)

    res.status(200).json({
      success: true,
      data: { message: response }
    })

  } catch (error) {
    next(error)
  }
}

// Get user's current usage stats
const getUsageStats = async (req, res, next) => {
  try {
    const userId = req.userId
    const user = await require('../models/user.model').findOne({ clerkId: userId })

    if (!user) {
      return next(new AppError('User not found', 404))
    }

    const plan = user.plan || 'free'
    const limits = PLAN_LIMITS[plan]
    
    const now = new Date()
    const lastDate = user.usage?.lastAnalysisDate
    const isNewDay = !lastDate || 
      new Date(lastDate).toDateString() !== now.toDateString()

    const currentCount = isNewDay ? 0 : (user.usage?.dailyAnalysisCount || 0)

    res.status(200).json({
      success: true,
      data: {
        plan,
        used: currentCount,
        limit: limits.dailyAnalyses,
        filesPerAnalysis: limits.fileAnalysisCount,
        remaining: limits.dailyAnalyses - currentCount,
        totalReposAnalyzed: user.stats?.reposAnalyzed || 0,
        upgradeAvailable: plan === 'free'
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { analyzeRepo, chatAboutRepo, getUsageStats }