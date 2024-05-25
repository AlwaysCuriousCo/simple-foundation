const path = require('path');

module.exports = function (app) {
  app.locals.basedir = path.join(__dirname, '..');
};
