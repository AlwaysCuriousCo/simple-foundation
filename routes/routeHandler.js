const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const router = express.Router();

async function getRoutesFromDB() {
  const client = new MongoClient(config.DATABASE_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db(config.DATABASE_NAME);
  const routes = await db.collection('routes').find().toArray();
  client.close();
  return routes;
}

router.get('/routes', async (req, res) => {
  try {
    const cachedRoutes = cache.get('routes');
    if (cachedRoutes) {
      logger.info('Routes fetched from cache');
      return res.json(cachedRoutes);
    }

    const routes = await getRoutesFromDB();
    cache.set('routes', routes);
    logger.info('Routes fetched from database');
    res.json(routes);
  } catch (error) {
    logger.error('Error fetching routes:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
