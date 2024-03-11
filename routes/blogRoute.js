const express = require("express");
const {
  createBlog,
  updateBlog,
  getAllBlog,
  getBlogById,
  deleteBlog,
  addBlogContent,
  addBlogImage,
  getBlogContentImg,
  getAllBlogBySubAdmin,
  getVerifiedBlog,
  updateBlogStatus,
} = require("../controllers/blogController");
const {
  createSubAdminRole,
  getSubAdminRole,
  deleteSubAdminRole,
} = require("../controllers/subAdminController");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post(
  "/create",
  validateUserToken,
  uploadToCloudinary("images"),
  createBlog
);
router.put("/content/:id", addBlogContent);
router.post("/image", uploadToCloudinary("contentImg"), addBlogImage);
router.put("/update/:id", uploadToCloudinary("images"), updateBlog);
router.patch("/status/:id", updateBlogStatus);
router.get("/", getAllBlog);
router.get("/verified", getVerifiedBlog);
router.get("/:id", getBlogById);
router.get("/image/single", getBlogContentImg);
router.get("/subAdmin/:id", getAllBlogBySubAdmin);
router.delete("/:id", deleteBlog);

///// SubAdmin Roles /////
router.post("/subAdminRoles", createSubAdminRole);
router.get("/subAdminRoles/all", getSubAdminRole);
router.delete("/subAdminRoles/:id", deleteSubAdminRole);

module.exports = router;
