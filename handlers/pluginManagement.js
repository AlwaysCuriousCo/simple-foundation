const path = require('path');
const fs = require('fs');
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

async function getPlugins() {
  const db = await connectToDatabase();
  return await db.collection('plugins').find().toArray();
}

module.exports.renderPluginManagementPage = async (req, res) => {
  const plugins = await getPlugins();
  res.render('pages/pluginManagement', { plugins });
};

module.exports.uploadPlugin = async (req, res) => {
  const pluginPath = req.pluginPath;
  const pluginConfigPath = path.join(pluginPath, 'plugin.json');

  if (!fs.existsSync(pluginConfigPath)) {
    return res.status(400).send('Invalid plugin package.');
  }

  const pluginConfig = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'));

  const db = await connectToDatabase();
  await db.collection('plugins').insertOne({ 
    name: pluginConfig.name, 
    path: pluginPath, 
    enabled: false, 
    createdAt: new Date(), 
    updatedAt: new Date() 
  });

  res.send('Plugin uploaded successfully. Activate it to use.');
};

module.exports.activatePlugin = async (req, res) => {
  const { pluginName } = req.body;

  const db = await connectToDatabase();
  const plugin = await db.collection('plugins').findOne({ name: pluginName });

  if (!plugin) {
    return res.status(404).send('Plugin not found.');
  }

  const pluginConfigPath = path.join(plugin.path, 'plugin.json');
  const pluginConfig = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'));

  pluginConfig.routes.forEach(async route => {
    await db.collection('routes').insertOne({ 
      ...route, 
      plugin: pluginName, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
  });

  pluginConfig.middlewares.forEach(async mw => {
    await db.collection('middlewares').insertOne({ 
      name: mw.name, 
      path: path.join(plugin.path, mw.path), 
      enabled: true, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
  });

  pluginConfig.views.forEach(async view => {
    const viewContent = fs.readFileSync(path.join(plugin.path, 'views', `${view.name}.pug`), 'utf-8');
    await db.collection('views').insertOne({ 
      name: view.name,
      path: view.path,
      content: viewContent,
      plugin: pluginName, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
  });

  await db.collection('plugins').updateOne({ name: pluginName }, { $set: { enabled: true, updatedAt: new Date() } });

  res.send('Plugin activated successfully.');
};

module.exports.deactivatePlugin = async (req, res) => {
  const { pluginName } = req.body;

  const db = await connectToDatabase();
  const plugin = await db.collection('plugins').findOne({ name: pluginName });

  if (!plugin) {
    return res.status(404).send('Plugin not found.');
  }

  const pluginConfigPath = path.join(plugin.path, 'plugin.json');
  const pluginConfig = JSON.parse(fs.readFileSync(pluginConfigPath, 'utf-8'));

  pluginConfig.routes.forEach(async route => {
    await db.collection('routes').deleteMany({ path: route.path, plugin: pluginName });
  });

  pluginConfig.middlewares.forEach(async mw => {
    await db.collection('middlewares').deleteMany({ name: mw.name, path: path.join(plugin.path, mw.path) });
  });

  pluginConfig.views.forEach(async view => {
    await db.collection('views').deleteMany({ name: view.name, plugin: pluginName });
  });

  await db.collection('plugins').updateOne({ name: pluginName }, { $set: { enabled: false, updatedAt: new Date() } });

  res.send('Plugin deactivated successfully.');
};
