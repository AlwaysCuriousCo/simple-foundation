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
  const db = await connectToDatabase();
  const users = await db.collection('users').find().toArray();

  res.json(users);
};
