const express = require('express');
const { registerAdmin, loginAdmin, forgotPasswordAdmin, createWorker, updateWorker, verifyPosts } = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.put('/forgotPassword', forgotPasswordAdmin);
router.post('/createWorker', createWorker);
router.put('/updateWorker/:id', updateWorker);
router.put('/verifyPost/:id', verifyPosts);

module.exports = router;