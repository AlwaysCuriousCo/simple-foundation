const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../../../config');
const logger = require('../../../utils/logger');

async function checkMongoConnection() {
  try {
    const client = new MongoClient(config.DATABASE_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    await client.db(config.DATABASE_NAME).command({ ping: 1 });
    client.close();
    return "Connected";
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    return "Disconnected";
  }
}

module.exports = async (req, res) => {
  const mongoStatus = await checkMongoConnection();

  res.render('healthcheck', {
    mongoStatus,
    config: JSON.stringify(config, null, 2)
  });
};
