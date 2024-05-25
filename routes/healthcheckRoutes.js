const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config');
const logger = require('../utils/logger');

const router = express.Router();

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

router.get('/healthcheck', async (req, res, next) => {
  try {
    const mongoStatus = await checkMongoConnection();
    res.render('healthcheck', {
      mongoStatus,
      config: JSON.stringify(config, null, 2)
    });
  } catch (error) {
    logger.error('Healthcheck route error:', error);
    next(error);
  }
});

module.exports = router;
