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
} = require("../controllers/blogController");
const {
  createSubAdminRole,
  getSubAdminRole,
  deleteSubAdminRole,
} = require("../controllers/subAdminController");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

router.post("/create", uploadToCloudinary("images"), createBlog);
router.put("/content/:id", addBlogContent);
router.put("/image/:id", uploadToCloudinary("contentImg"), addBlogImage);
router.put("/update/:id", uploadToCloudinary("images"), updateBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlogById);
router.get("/image/:id", getBlogContentImg);
router.delete("/:id", deleteBlog);

///// SubAdmin Roles /////
router.post("/subAdminRoles", createSubAdminRole);
router.get("/subAdminRoles/all", getSubAdminRole);
router.delete("/subAdminRoles/:id", deleteSubAdminRole);

module.exports = router;
