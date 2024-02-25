const express = require("express");
const {
  registerSubAdmin,
  loginSubAdmin,
  forgotPasswordSubAdmin,
  createWorker,
  AllUser,
  updateWorker,
  getSingleSubAdmin,
  addSubAdminImage,
  updateSubAdmin,
} = require("../controllers/subAdminController");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

///// POST Routes /////
router.post("/register", registerSubAdmin);
router.post("/forgot", forgotPasswordSubAdmin);
router.post("/login", loginSubAdmin);
router.post(
  "/createWorker",
  uploadToCloudinary("profileImg"),
  validateUserToken,
  createWorker
);

///// PUT Routes /////
router.put("/updateWorker/:id", uploadToCloudinary("profileImg"), updateWorker);
router.put(
  "/addImage/:id",
  uploadToCloudinary("subAdminImg"),
  addSubAdminImage
);
router.put("/update/:id", updateSubAdmin);

///// GET Routes /////
router.get("/all", AllUser);
router.get("/profile/:id", getSingleSubAdmin);

module.exports = router;
