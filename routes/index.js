const express = require('express');
const authRoutes = require('./authRoutes');
const pluginRoutes = require('./pluginRoutes');
const userRoutes = require('./userRoutes');
const redirectRoutes = require('./redirectRoutes');
const healthcheckRoutes = require('./healthcheckRoutes');

const router = express.Router();

router.use(authRoutes);
router.use(pluginRoutes);
router.use(userRoutes);
router.use(redirectRoutes);
router.use(healthcheckRoutes);

module.exports = router;
