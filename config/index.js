const databaseConfig = require('./database');
const appConfig = require('./app');
const loggingConfig = require('./logging');

module.exports = {
  ...databaseConfig,
  ...appConfig,
  ...loggingConfig
};
