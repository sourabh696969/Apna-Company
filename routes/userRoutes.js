const express = require('express');
const { registerUser, loginUser, veifyOtp, currentUser, AllUser } = require('../controllers/userController');
const { validateUserToken } = require('../middleware/validateTokenHandler');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', veifyOtp);
router.get('/currentUser', validateUserToken, currentUser);
router.get('/all', validateUserToken, AllUser);

module.exports = router;