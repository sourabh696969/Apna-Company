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

///// POST Routes /////
router.post("/register", validateUserToken, registerUser);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);

///// GET Routes /////
router.get("/single/:id", getUserById);
router.get("/all", getAllUser);

///// DELETE Routes /////
router.delete("/:id", deleteUser);

module.exports = router;
