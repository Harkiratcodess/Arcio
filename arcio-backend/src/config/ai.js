const Groq = require('groq-sdk')
const logger = require('../utils/logger')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const getAIResponse = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
  })
  return response.choices[0].message.content
}

logger.info('Groq AI initialized')

module.exports = { getAIResponse }