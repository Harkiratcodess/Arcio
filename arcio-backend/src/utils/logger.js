const winston = require('winston')
const path = require('path')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'arcio-backend' },
  transports: [
    // ✅ error.log: max 5MB, keep last 3 files
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,  // 5MB
      maxFiles: 3,
      tailable: true
    }),

    // ✅ combined.log: max 10MB, keep last 5 files
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
  ],
})

// ✅ Console: clean readable format, not raw JSON
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  )
}))

module.exports = logger