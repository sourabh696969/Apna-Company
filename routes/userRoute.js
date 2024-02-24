const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  signupUser,
  getAllUser,
  getUserById,
  deleteUser,
  getAllUserByLocation,
} = require("../controllers/userController");
const { validateUserToken } = require("../middleware/validateTokenHandler");
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

///// POST Routes /////
router.post(
  "/register",
  upload.fields([{ name: "profileImg", maxCount: 1 }]),
  validateUserToken,
  registerUser
);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);

///// GET Routes /////
router.get("/single/:id", getUserById);
router.get("/all", getAllUser);

///// DELETE Routes /////
router.delete("/:id", deleteUser);

module.exports = router;
