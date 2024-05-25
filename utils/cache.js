const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache items for 10 minutes

module.exports = {
  get(key) {
    return cache.get(key);
  },

  set(key, value) {
    cache.set(key, value);
  },

  del(key) {
    cache.del(key);
  }
};
