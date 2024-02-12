const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  currentUser,
  AllUser,
  signupUser,
} = require("../controllers/workerController");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const {
  createRole,
  getRole,
  deleteRole,
  updateRole,
} = require("../controllers/categoryController");
const {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { AllUserById } = require("../controllers/workerController");
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

/////// Authentication ////////
router.post("/register", validateUserToken, registerUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);
router.get("/currentWorker", validateUserToken, currentUser);
router.get("/all", AllUser);

/////// Role ////////
router.post("/role", createRole);
router.get("/role", getRole);
router.delete("/role/:id", deleteRole);
router.put("/role/:id", updateRole);

/////// Category ////////
router.post(
  "/category",
  upload.fields([{ name: "categoryImg", maxCount: 1 }]),
  createCategory
);
router.delete("/category/:id", deleteCategory);
router.put(
  "/category/:id",
  upload.fields([{ name: "categoryImg", maxCount: 1 }]),
  updateCategory
);
router.get("/category", getCategory);
router.get("/category/:id", AllUserById);

module.exports = router;