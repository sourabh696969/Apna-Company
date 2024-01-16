const express = require('express');
const { registerAgent, loginAgent, veifyOtp, currentUser, signupUser } = require('../controllers/agentController');
const { validateAgentToken } = require('../middleware/validateTokenHandler');
const { createCategory, getCategory,  } = require('../controllers/categoryController');
const { AllUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/register',validateAgentToken, registerAgent);
router.post('/login', loginAgent);
router.post('/verify', veifyOtp);
router.get('/currentAgent', validateAgentToken, currentUser);
router.post('/category', createCategory);
router.post('/signup', signupUser);
router.get('/category', getCategory);
router.get('/category/:id', AllUserById);

module.exports = router;