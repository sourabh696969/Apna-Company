const express = require('express');
const { createWorkPost, updateWorkPost, getWorkPostById, getWorkPostByWork } = require('../controllers/workPostControllers');
const { validateUserToken } = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/workpost',validateUserToken, createWorkPost);
router.put('/workpost/:id', updateWorkPost);
router.get('/workpost',validateUserToken, getWorkPostById);
router.get('/workpost/:id', getWorkPostByWork);

module.exports = router;