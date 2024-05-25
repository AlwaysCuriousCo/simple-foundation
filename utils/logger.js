const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure the logs directory exists
const logDir = config.logFilePath;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, 'app.log') }),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
  ]
});

module.exports = logger;
