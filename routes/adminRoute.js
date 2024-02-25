const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  forgotPasswordAdmin,
  createWorker,
  updateWorker,
  verifyPosts,
  getLengthOfData,
  verifySubAdmin,
  deleteSubAdmin,
  getAllSubAdmin,
  getWorkerBySubAdminId,
  updateUserSupport,
  updateWorkerSupport,
  createAppNotificationUser,
  createAppNotificationWorker,
  createAppNotificationForAllUsers,
  createAppNotificationForAllWorkers,
} = require("../controllers/adminController");
// const multer = require("multer");
// const path = require("path");
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "upload", // Specify the folder in Cloudinary where you want to store the files
//     allowed_formats: ["jpg", "jpeg", "png", "gif"], // Specify allowed file formats
//     //  transformation: [{ width: 150, height: 150, crop: 'limit' }], // Optional: image transformations
//   },
// });

// const upload = multer({ storage: storage });

///// POST Routes /////
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/createWorker", uploadToCloudinary("profileImg"), createWorker);
router.post("/notificationUser", createAppNotificationUser);
router.post("/notificationAllUser", createAppNotificationForAllUsers);
router.post("/notificationWorker", createAppNotificationWorker);
router.post("/notificationAllWorker", createAppNotificationForAllWorkers);

///// PUT & PATCH Routes /////
router.put("/verifyPost/:id", verifyPosts);
router.put(
  "/updateWorker/:id",
  uploadToCloudinary("profileImg"),
  updateWorker
);
router.put("/forgotPassword", forgotPasswordAdmin);
router.patch("/verifySubAdmin/:id", verifySubAdmin);
router.patch("/updateUserSupport/:id", updateUserSupport);
router.patch("/updateWorkerSupport/:id", updateWorkerSupport);

///// GET Routes /////
router.get("/counts", getLengthOfData);
router.get("/SubAdmin", getAllSubAdmin);
router.get("/workerBySubadmin/:id", getWorkerBySubAdminId);

///// DELETE Routes /////
router.delete("/deleteSubAdmin/:id", deleteSubAdmin);

module.exports = router;
