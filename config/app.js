const path = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key_here',
    viewsDirectory: './views',
  };
  