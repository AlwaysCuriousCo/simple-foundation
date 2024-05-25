const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../../../config');
const logger = require('../../../utils/logger');

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

module.exports = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    logger.warn('Missing username for user deletion');
    return res.status(400).send('Username is required.');
  }

  const db = await connectToDatabase();
  const result = await db.collection('users').deleteOne({ username });

  if (result.deletedCount === 0) {
    logger.warn(`User not found: ${username}`);
    return res.status(404).send('User not found.');
  }

  logger.info(`User deleted successfully: ${username}`);
  res.send('User deleted successfully.');
};
