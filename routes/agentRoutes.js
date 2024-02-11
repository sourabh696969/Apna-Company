const express = require('express');
const { registerAgent, loginAgent, veifyOtp, currentUser, signupUser } = require('../controllers/agentController');
const { validateUserToken } = require('../middleware/validateTokenHandler');
const { createCategory, getCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { AllUserById } = require('../controllers/userController');
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "upload", // Specify the folder in Cloudinary where you want to store the files
      allowed_formats: ["jpg", "jpeg", "png", "gif"], // Specify allowed file formats
      //  transformation: [{ width: 150, height: 150, crop: 'limit' }], // Optional: image transformations
    },
  });
  
  const upload = multer({ storage: storage });

router.post('/register',validateUserToken, registerAgent);
router.post('/login', loginAgent);
router.post('/verify', veifyOtp);
router.get('/currentAgent', validateUserToken, currentUser);
router.post('/category', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), createCategory);
router.delete('/category/:id', deleteCategory);
router.put('/category/:id', upload.fields([{ name: 'categoryImg', maxCount: 1 }]), updateCategory);
router.post('/signup', signupUser);
router.get('/category', getCategory);
router.get('/category/:id', AllUserById);

module.exports = router;