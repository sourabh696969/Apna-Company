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
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

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
router.put("/updateWorker/:id", uploadToCloudinary("profileImg"), updateWorker);
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
