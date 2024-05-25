const express = require('express');
const {
  renderPluginManagementPage,
  uploadPlugin,
  activatePlugin,
  deactivatePlugin
} = require('../handlers/pluginManagement');
const uploadMiddleware = require('../uploadMiddleware');
const extractMiddleware = require('../extractMiddleware');

const router = express.Router();

router.get('/plugin-management', renderPluginManagementPage);
router.post('/upload-plugin', uploadMiddleware, extractMiddleware, uploadPlugin);
router.post('/activate-plugin', activatePlugin);
router.post('/deactivate-plugin', deactivatePlugin);

module.exports = router;
