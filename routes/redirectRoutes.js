const express = require('express');
const { addRedirect, deleteRedirect, listRedirects } = require('../handlers/redirects');

const router = express.Router();

router.post('/api/redirects/add', addRedirect);
router.delete('/api/redirects/delete', deleteRedirect);
router.get('/api/redirects', listRedirects);

module.exports = router;
