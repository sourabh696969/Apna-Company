const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  forgotPasswordAdmin,
  createWorker,
  updateWorker,
  verifyPosts,
  updateSupport,
  getLengthOfData,
  verifySubAdmin,
  deleteSubAdmin,
  getAllSubAdmin,
  getWorkerBySubAdminId,
} = require("../controllers/adminController");
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

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/forgotPassword", forgotPasswordAdmin);
router.post(
  "/createWorker",
  upload.fields([{ name: "profileImg", maxCount: 1 }]),
  createWorker
);
router.put(
  "/updateWorker/:id",
  upload.fields([{ name: "profileImg", maxCount: 1 }]),
  updateWorker
);
router.put("/verifyPost/:id", verifyPosts);
router.put("/updateSupport/:id", updateSupport);
router.patch("/verifySubAdmin/:id", verifySubAdmin);
router.get("/counts", getLengthOfData);
router.delete("/deleteSubAdmin/:id", deleteSubAdmin);
router.get("/SubAdmin", getAllSubAdmin);
router.get("/workerBySubadmin/:id", getWorkerBySubAdminId);

module.exports = router;
