const express = require("express");
const {
  registerUser,
  loginUser,
  veifyOtp,
  AllUser,
  signupUser,
  getUserById,
  deleteUser,
  AllUserByRole,
  AllUserByLocation,
  updateWorkerAvailablity,
  searchUser,
  testingOtp,
} = require("../controllers/workerController");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const {
  createRole,
  getRole,
  deleteRole,
  updateRole,
  updateRoleStatus,
  getSingleCategory,
} = require("../controllers/categoryController");
const {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");
const { AllUserById } = require("../controllers/workerController");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

/////// Authentication ////////
router.post(
  "/register",
  validateUserToken,
  uploadToCloudinary("profileImg"),
  registerUser
);
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.post("/verify", veifyOtp);
router.post("/testing", testingOtp);
router.get("/single/:id", getUserById);
router.get("/single/:catid/:roleid", validateUserToken, AllUserByRole);
router.get("/all", AllUser);
router.get("/search", searchUser);
router.get("/allByLocation", validateUserToken, AllUserByLocation);
router.delete("/:id", deleteUser);
router.patch("/available/:id", updateWorkerAvailablity);

/////// Role ////////
router.post("/role", createRole);
router.get("/role", getRole);
router.delete("/role/:id", deleteRole);
router.put("/role/:id", updateRole);
router.patch("/role/:id", updateRoleStatus);

/////// Category ////////
router.post("/category", uploadToCloudinary("categoryImg"), createCategory);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", uploadToCloudinary("categoryImg"), updateCategory);
router.get("/category", getCategory);
router.get("/singleCategory/:id", getSingleCategory);
router.get("/category/:id", validateUserToken, AllUserById);

module.exports = router;
