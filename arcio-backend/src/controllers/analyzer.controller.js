const { octokit } = require('../config/github')
const { getAIResponse } = require('../config/ai')
const { setCache, getCache } = require('../utils/cache')
const { AppError } = require('../middleware/errorHandler')
const { incrementUsage, PLAN_LIMITS } = require('../middleware/usageLimit')
const Analysis = require('../models/analysis.model')
const User = require('../models/user.model')
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
  const treeRes = await octokit.rest.git.getTree({ owner, repo, tree_sha: 'HEAD', recursive: 'true' })
  const fileTree = treeRes.data.tree
    .filter(f => f.type === 'blob')
    .map(f => f.path)

  const repoInfo = await octokit.rest.repos.get({ owner, repo })
  const repoData = repoInfo.data

  // Find README with case-insensitivity
  const actualReadmePath = fileTree.find(f => f.toLowerCase() === 'readme.md')
  let readmeContent = ''
  let readmeExists = false

  if (actualReadmePath) {
    try {
      const readmeRes = await octokit.rest.repos.getContent({ owner, repo, path: actualReadmePath })
      if (readmeRes.data.content) {
        readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8')
        readmeExists = true
      }
    } catch (err) {
      logger.warn(`Failed to fetch README at ${actualReadmePath}: ${err.message}`)
    }
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
    /\.(js|ts|tsx|jsx|py|java|go|rs|rb|php|cs|html|css)$/i,
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
  
  // Ensure we definitely include the entry point if it exists
  const topFiles = scored.slice(0, maxFiles).map(s => s.path)
  return topFiles
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

    /* Commenting out cache to ensure user sees the fresh fix for case-sensitivity and deep analysis
    const cached = await getCache(cacheKey)
    if (cached) {
      logger.info(`Cache hit for repo: ${owner}/${repo} (${userPlan})`)

      // Still increment usage even for cached results
      if (req.userDoc) {
        await incrementUsage(req.userDoc, req.redisKey)
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
    */

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
    
    // Explicitly fetch package.json for better context
    let packageJsonContent = 'Not found'
    if (fileTree.includes('package.json')) {
      const pj = await fetchFileContent(owner, repo, 'package.json')
      if (pj) packageJsonContent = pj.slice(0, 1500)
    }

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
    const aiPrompt = `### ROLE
You are a WORLD-CLASS Senior Software Architect performing a deep-dive technical audit for a developer's portfolio project. 
Your goal is to provide GENUINE, TECHNICAL, and OPINIONATED feedback. 

### REPOSITORY CONTEXT
- Repo: ${owner}/${repo}
- Primary Language: ${repoData.language || 'Unknown'}
- README Status: ${readmeExists ? 'ALREADY EXISTS (DO NOT SUGGEST ADDING ONE)' : 'MISSING'}
- Package.json Status: ${packageJsonContent !== 'Not found' ? 'FOUND' : 'MISSING'}

### REPOSITORY DATA
**FILE TREE:**
${fileTree.slice(0, 100).join('\n')}

**README CONTENT:**
${readmeContent ? readmeContent.slice(0, 4000) : 'NO README CONTENT PROVIDED'}

**PACKAGE.JSON:**
${packageJsonContent}

**ACTUAL SOURCE CODE SAMPLES:**
${fileAnalysisSection}

### YOUR CHALLENGE
Developers hate generic advice. They already know they should "add tests" or "add a README". 
Your job is to look at the ACTUAL CODE above and find patterns that need fixing.

**STRICT RESPONSE RULES:**
1. **NO GENERIC ADVICE:** Never suggest "Add a README", "Add tests", or "Add a license" unless the file is truly missing AND it's the most critical thing to fix. Since the README is ${readmeExists ? 'ALREADY PRESENT' : 'MISSING'}, act accordingly.
2. **CODE-LEVEL FEEDBACK:** At least 2 improvements MUST cite specific logic, components, or patterns found in the "ACTUAL SOURCE CODE SAMPLES" above.
3. **CITATIONS:** Every improvement MUST include a "fileLocation".
4. **EXAMPLES:** Every improvement MUST include a "example" snippet showing a better implementation.
5. **ARCHITECTURAL GRIT:** Be honest. If the code is messy, explain why. If the structure is flat, suggest a modular approach.

### OUTPUT FORMAT
Respond ONLY in this exact JSON format:
{
  "codeQualityScore": 75,
  "summary": "3-4 sentences of gritty, honest technical assessment.",
  "improvements": [
    {
      "title": "Specific Technical Title",
      "description": "Deeply technical explanation of the issue and why the current pattern is bad for scalability or maintenance.",
      "difficulty": "Quick Fix | Medium | Hard",
      "priority": "Critical | Important | Nice to Have",
      "fileLocation": "src/path/to/file.ext",
      "example": "// code here"
    }
  ]
}`

    const aiResponse = await getAIResponse(aiPrompt)

    let aiData
    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim()
      aiData = JSON.parse(cleaned)
    } catch {
      logger.error(`AI response parse failed. Raw response: ${aiResponse}`)
      aiData = {
        codeQualityScore: 70,
        improvements: [],
        summary: aiResponse
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

    // Save to Analysis Collection
    const newAnalysis = await Analysis.create({
      userId: req.userId,
      repoUrl: repoUrl,
      repoFullName: `${owner}/${repo}`,
      scores: result.scores,
      improvements: result.improvements,
      summary: result.summary,
      public: true
    })

    // Update User Stats
    if (req.userDoc) {
      const user = req.userDoc
      const newTotalRepos = (user.stats?.reposAnalyzed || 0) + 1
      const currentAvg = user.stats?.averageScore || 0
      const newAvg = Math.round(((currentAvg * (newTotalRepos - 1)) + overallScore) / newTotalRepos)
      const newTopScore = Math.max(user.stats?.topScore || 0, overallScore)
      
      // Streak logic
      let newStreak = user.stats?.weeklyStreak || 0
      const lastAnalyzed = user.stats?.lastAnalyzedAt
      const now = new Date()
      
      if (lastAnalyzed) {
        const diffDays = Math.floor((now - new Date(lastAnalyzed)) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          newStreak += 1
        } else if (diffDays > 1) {
          newStreak = 1
        }
      } else {
        newStreak = 1
      }

      await User.findByIdAndUpdate(user._id, {
        $set: {
          'stats.topScore': newTopScore,
          'stats.averageScore': newAvg,
          'stats.weeklyStreak': newStreak,
          'stats.lastAnalyzedAt': now,
          'stats.lastScoreChange': overallScore - (user.scores?.overall || 0) // Approximation
        }
      })

      await incrementUsage(user, req.redisKey)
    }

    logger.info(`Analysis complete and saved for ${owner}/${repo} — score: ${overallScore}`)

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

    const systemPrompt = `You are Arcio Architect, an elite technical lead and portfolio consultant. 
You are discussing the architectural audit of ${repoContext?.repo?.fullName || 'this repository'}.

### AUDIT CONTEXT
- Score: ${repoContext?.scores?.overall || 'unknown'}/100
- Improvements Identified: ${repoContext?.improvements?.map(i => i.title).join(', ') || 'none'}
- Files Analyzed: ${repoContext?.filesAnalyzed || 0}

### COMMUNICATION STYLE (Claude/GPT-4o Style)
- Be extremely technical and direct.
- Use a sophisticated, helpful, and analytical tone.
- If the user asks about a "lack of README" or other generic issues that were identified erroneously in the past, acknowledge that you are now looking at the ACTUAL code and provide a better insight.
- Provide 2-3 line code snippets if it helps clarify a point.
- Focus on how the developer can impress recruiters with their code structure.
- NO generic advice. If you can't be specific, be inquisitive about their design choices.
- DO NOT use emojis. Keep it professional and editorial.

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