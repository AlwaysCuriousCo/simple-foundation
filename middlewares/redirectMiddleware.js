const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config');
const logger = require('../utils/logger');

async function connectToDatabase() {
  const client = new MongoClient(config.DATABASE_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  return client.db(config.DATABASE_NAME);
}

module.exports = async (req, res, next) => {
  const db = await connectToDatabase();
  const redirects = await db.collection('redirects').find().toArray();

  for (let redirect of redirects) {
    const fromRegex = new RegExp(`^${redirect.from.replace('*', '.*')}$`);
    if (fromRegex.test(req.path)) {
      logger.info(`Redirecting: ${req.path} -> ${redirect.to} [${redirect.status}]`);
      return res.redirect(redirect.status, redirect.to);
    }
  }

  next();
};
