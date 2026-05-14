const Idea = require('../models/ideas.model')
const { getAIResponse } = require('../config/ai')
const logger = require('../utils/logger')

exports.getIdeas = async (req, res) => {
  try {
    const { category, difficulty, q, page = 1, limit = 12 } = req.query
    const skip = (page - 1) * limit
    let query = {}

    if (category) query.categoryTags = { $in: [category] }
    if (difficulty) query.difficulty = difficulty
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { stack: { $in: [new RegExp(q, 'i')] } }
      ]
    }

    // Shuffle logic: Newest first, but also keep importanceScore as secondary sort
    const ideas = await Idea.find(query)
      .sort({ createdAt: -1, importanceScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Idea.countDocuments(query)

    res.json({
      success: true,
      data: ideas,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasMore: skip + ideas.length < total
      }
    })
  } catch (error) {
    logger.error(`Error fetching ideas: ${error.message}`)
    res.status(500).json({ success: false, message: 'Failed to fetch architecture ideas' })
  }
}

exports.ideaBuilder = async (req, res) => {
  try {
    const { ideaId, message, chatHistory } = req.body

    const selectedIdea = await Idea.findById(ideaId)
    if (!selectedIdea) {
      return res.status(404).json({ success: false, message: 'Idea not found' })
    }

    const historyPrompt = chatHistory?.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n') || ''

    const ideaBuilderPrompt = `You are Arcio's Senior Architect Mentor. You are guiding a developer through building a specific project architecture.
    
Current Project Context:
Title: ${selectedIdea.title}
Stack: ${selectedIdea.stack.join(', ')}
Difficulty: ${selectedIdea.difficulty}
Core Description: ${selectedIdea.description}
Skills Focused: ${selectedIdea.skillsTaught.join(', ')}

Previous Conversation:
${historyPrompt}

User's Current Inquiry:
${message}

**STRICT ARCHITECTURAL MENTORSHIP RULES:**
1. NEVER provide full code implementations, complete functions, or copy-pasteable files.
2. NEVER write logic (no if/else, loops, or complex algorithms).
3. ONLY provide structural guidance: directory trees, interface definitions (no implementation), and architectural patterns (e.g., "Use a Factory pattern here").
4. SUGGEST specific libraries or tools that fit the stack.
5. PROVIDE terminal commands for setup and dependency management.
6. EXPLAIN the "why" behind architectural choices.
7. LIMIT any pseudo-code to 5-8 lines max, focusing ONLY on structural layout.
8. If the user asks for code, politely decline and explain that your role is to develop their architectural thinking, then provide the structural blueprint for that feature.
9. Maintain a professional, senior-developer tone. Avoid emojis.

Answer the inquiry with high-density architectural value.`

    const response = await getAIResponse(ideaBuilderPrompt)

    res.json({
      success: true,
      data: {
        message: response
      }
    })
  } catch (error) {
    logger.error(`Error in ideaBuilder: ${error.message}`)
    res.status(500).json({ success: false, message: 'Architectural assistant encountered an error' })
  }
}

exports.triggerScraper = async (req, res) => {
  try {
    const { runIdeaScraper } = require('../jobs/ideas.scraper')
    const result = await runIdeaScraper()

    res.json({
      success: true,
      message: 'Scraper triggered successfully',
    })
  } catch (error) {
    logger.error(`Manual scraper trigger failed: ${error.message}`)
    res.status(500).json({
      success: false,
      message: 'Failed to trigger scraper',
      error: error.message
    })
  }
}