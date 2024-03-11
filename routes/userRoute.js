const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  signupUser,
  getAllUser,
  getUserById,
  deleteUser,
  testingOtp,
} = require("../controllers/userController");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

///// POST Routes /////
router.post(
  "/register",
  uploadToCloudinary("profileImg"),
  validateUserToken,
  registerUser
);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);
router.post("/testing", testingOtp);

///// GET Routes /////
router.get("/single/:id", getUserById);
router.get("/all", getAllUser);

///// DELETE Routes /////
router.delete("/:id", deleteUser);

module.exports = router;
