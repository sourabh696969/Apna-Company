const express = require('express');
const { createWorkPost, updateWorkPost, getWorkPostById, getWorkPostByWork } = require('../controllers/workPostControllers');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { createRole, getRole, deleteRole, updateRole } = require('../controllers/categoryController');

const router = express.Router();

router.post('/workpost',validateUserToken, createWorkPost);

module.exports = router;