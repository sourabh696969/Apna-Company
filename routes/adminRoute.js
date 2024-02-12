const express = require('express');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

module.exports = router;