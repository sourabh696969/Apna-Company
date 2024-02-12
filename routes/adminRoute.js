const express = require('express');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { registerAdmin, loginAdmin, forgotPasswordAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/forgotPassword', forgotPasswordAdmin);

module.exports = router;