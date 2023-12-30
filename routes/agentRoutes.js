const express = require('express');
const { registerAgent, loginAgent, veifyOtp, currentUser } = require('../controllers/agentController');
const { validateAgentToken } = require('../middleware/validateTokenHandler');
const { createCategory, getCategory,  } = require('../controllers/categoryController');
const { AllUserById } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerAgent);
router.post('/login', loginAgent);
router.post('/verify', veifyOtp);
router.get('/currentAgent', validateAgentToken, currentUser);
router.post('/category', validateAgentToken, createCategory);
router.get('/category', validateAgentToken, getCategory);
router.get('/category/:id', validateAgentToken, AllUserById);

module.exports = router;