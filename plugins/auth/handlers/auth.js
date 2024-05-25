const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

module.exports.renderLoginPage = (req, res) => {
  logger.info('Rendering login page');
  res.render('pages/login');
};

module.exports.renderRegisterPage = (req, res) => {
  logger.info('Rendering register page');
  res.render('pages/register');
};

module.exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    logger.warn('Missing username, password, or role for registration');
    return res.status(400).send('Username, password, and role are required.');
  }

  if (!['super-admin', 'admin', 'manager', 'editor', 'contributor', 'subscriber'].includes(role)) {
    logger.warn(`Invalid role specified: ${role}`);
    return res.status(400).send('Invalid role specified.');
  }

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ username });

  if (user) {
    logger.warn(`User already exists: ${username}`);
    return res.status(400).send('User already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  await db.collection('users').insertOne({ username, password: hashedPassword, role, createdAt: new Date(), updatedAt: new Date() });

  logger.info(`User registered successfully: ${username}`);
  res.send('User registered successfully.');
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn('Missing username or password for login');
    return res.status(400).send('Username and password are required.');
  }

  const db = await connectToDatabase();
  const user = await db.collection('users').findOne({ username });

  if (!user) {
    logger.warn(`User not found: ${username}`);
    return res.status(400).send('User not found.');
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    logger.warn(`Invalid password for user: ${username}`);
    return res.status(401).send('Invalid password.');
  }

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, config.JWT_SECRET, { expiresIn: '24h' });

  logger.info(`User logged in successfully: ${username}`);
  res.send({ auth: true, token });
};

module.exports.logout = (req, res) => {
  logger.info('User logged out');
  res.send({ auth: false, token: null });
};
