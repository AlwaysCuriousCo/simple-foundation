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

module.exports.addRedirect = async (req, res) => {
  const { from, to, status, tags } = req.body;

  if (!from || !to || !status) {
    return res.status(400).send('From, To, and Status are required.');
  }

  const db = await connectToDatabase();
  await db.collection('redirects').insertOne({
    from,
    to,
    status,
    tags: tags || [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  logger.info(`Redirect added: ${from} -> ${to} [${status}]`);
  res.send('Redirect added successfully.');
};

module.exports.deleteRedirect = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('ID is required.');
  }

  const db = await connectToDatabase();
  const result = await db.collection('redirects').deleteOne({ _id: new MongoClient.ObjectID(id) });

  if (result.deletedCount === 0) {
    return res.status(404).send('Redirect not found.');
  }

  logger.info(`Redirect deleted: ${id}`);
  res.send('Redirect deleted successfully.');
};

module.exports.listRedirects = async (req, res) => {
  const db = await connectToDatabase();
  const redirects = await db.collection('redirects').find().toArray();

  res.json(redirects);
};
