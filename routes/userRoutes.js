const express = require('express');
const createAdminUser = require('../plugins/userManager/handlers/createAdminUser');
const deleteAdminUser = require('../plugins/userManager/handlers/deleteAdminUser');
const getAdminUsersPage = require('../plugins/userManager/handlers/getAdminUsersPage');
const listAdminUsers = require('../plugins/userManager/handlers/listAdminUsers');

const router = express.Router();

router.get('/admin/users', getAdminUsersPage);
router.post('/api/admin/create-user', createAdminUser);
router.delete('/api/admin/delete-user', deleteAdminUser);
router.get('/api/admin/users', listAdminUsers);

module.exports = router;
