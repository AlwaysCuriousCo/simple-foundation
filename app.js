require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./config');
const logger = require('./utils/logger');
const redirectMiddleware = require('./middlewares/redirectMiddleware');
const routes = require('./routes');  // Import the routes

const app = express();

async function getViewDirectories() {
  const client = new MongoClient(config.DATABASE_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db(config.DATABASE_NAME);
  const enabledPlugins = await db.collection('plugins').find({ enabled: true }).toArray();
  client.close();

  const pluginViewDirs = enabledPlugins.map(plugin => path.join(__dirname, `plugins/${plugin.name}/views`));
  return [path.join(__dirname, 'views'), ...pluginViewDirs];
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to log detailed information about each request and response
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

if (config.logLevel !== 'none') {
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}

app.use(redirectMiddleware);
app.use(routes);  // Use the extracted routes

// Middleware to serve views dynamically from the database
app.use(async (req, res, next) => {
  const client = new MongoClient(config.DATABASE_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db(config.DATABASE_NAME);

  const view = await db.collection('views').findOne({ path: req.path });

  if (view) {
    return res.render('base', {
      content: view.content
    });
  }

  next();
});

// Initialize and add middlewares from database
async function initializeMiddleware(app) {
  const client = new MongoClient(config.DATABASE_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  await client.connect();
  const db = client.db(config.DATABASE_NAME);

  const middlewares = await db.collection('middlewares').find({ enabled: true }).toArray();
  middlewares.forEach(mwConfig => {
    const middleware = require(mwConfig.path);
    app.use(middleware); // Ensure that 'middleware' is a valid middleware function
  });
}

// Initialize and add routes from database
async function initializeRoutes(app) {
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
  routes.forEach(route => {
    const handler = require(route.handler);
    app[route.method.toLowerCase()](route.path, handler);
  });
}

async function initializeApp() {
  console.log('Initializing UI...');
  const viewDirs = await getViewDirectories();
  app.set('views', viewDirs);
  app.set('view engine', 'pug');
  app.locals.basedir = app.get('views')[0];  // Set the basedir for Pug
  console.log('UI initialized.');

  console.log('Initializing middleware...');
  await initializeMiddleware(app);
  console.log('Middleware initialized.');

  console.log('Initializing routes...');
  await initializeRoutes(app);
  console.log('Routes initialized.');

  app.listen(config.PORT, () => {
    logger.info(`Simple Foundation server is running on port ${config.PORT}`);
    console.log(`Simple Foundation server is running on port ${config.PORT}`);
  });
}

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500);
  res.render(`errors/${err.status || 500}`, { error: err });
});

initializeApp();
