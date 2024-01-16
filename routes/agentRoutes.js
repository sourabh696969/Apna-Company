const express = require('express');
const { registerAgent, loginAgent, veifyOtp, currentUser, signupUser } = require('../controllers/agentController');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { createCategory, getCategory,  } = require('../controllers/categoryController');
const { AllUserById } = require('../controllers/userController');
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB (adjust as needed)
    },
})

router.post('/register',validateUserToken, registerAgent);
router.post('/login', loginAgent);
router.post('/verify', veifyOtp);
router.get('/currentAgent', validateUserToken, currentUser);
router.post('/category', upload.single('categoryImg'), createCategory);
router.post('/signup', signupUser);
router.get('/category', getCategory);
router.get('/category/:id', AllUserById);

module.exports = router;