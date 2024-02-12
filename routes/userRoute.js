const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  currentUser,
  signupUser,
  getAllUser,
} = require("../controllers/userController");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", validateUserToken, registerUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);
router.get("/currentUser", validateUserToken, currentUser);
router.get("/all", getAllUser);

module.exports = router;
