const express = require('express');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { registerAdmin, loginAdmin, forgotPasswordAdmin, createWorker, updateWorker } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/forgotPassword', forgotPasswordAdmin);
router.post('/createWorker', createWorker);
router.put('/updateWorker/:id', updateWorker);

module.exports = router;