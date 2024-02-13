const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  signupUser,
  getAllUser,
  getUserById,
  deleteUser,
} = require("../controllers/userController");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", validateUserToken, registerUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);
router.get("/single/:id", getUserById);
router.get("/all", getAllUser);
router.delete("/:id", deleteUser);

module.exports = router;
