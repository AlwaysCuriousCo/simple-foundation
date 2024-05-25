const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
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
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    logger.warn('Missing username, password, or role for user creation');
    return res.status(400).send('Username, password, and role are required.');
  }

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ username });

  if (user) {
    logger.warn(`User already exists: ${username}`);
    return res.status(400).send('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  await db.collection('users').insertOne({ username, password: hashedPassword, role, createdAt: new Date(), updatedAt: new Date() });

  logger.info(`User created successfully: ${username}`);
  res.send('User created successfully.');
};
