const express = require('express');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { registerAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);

module.exports = router;