const path = require('path');

module.exports = {
  logFilePath: process.env.LOG_FILE_PATH || path.join(__dirname, '../logs' ),
  logLevel: process.env.LOG_LEVEL || 'none',  // Possible values: 'none', 'debug', 'info', 'warn', 'error', 'fatal'
};
