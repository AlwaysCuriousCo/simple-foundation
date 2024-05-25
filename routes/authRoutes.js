const express = require('express');
const { register, login, logout } = require('../plugins/auth/handlers/auth');

const router = express.Router();

router.get('/login', (req, res) => res.render('pages/login'));
router.post('/login', login);
router.get('/register', (req, res) => res.render('pages/register'));
router.post('/register', register);
router.post('/logout', logout);

module.exports = router;
