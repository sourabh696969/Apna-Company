const express = require("express");
const {
  createBlog,
  updateBlog,
  getAllBlog,
  getBlogById,
  deleteBlog,
} = require("../controllers/blogController");
const { createSubAdminRole, getSubAdminRole, deleteSubAdminRole } = require("../controllers/subAdminController");

const router = express.Router();

router.post("/create", createBlog);
router.put("/update/:id", updateBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlogById);
router.delete("/:id", deleteBlog);

///// SubAdmin Roles /////
router.post("/subAdminRoles", createSubAdminRole);
router.get("/subAdminRoles/all", getSubAdminRole);
router.delete("/subAdminRoles/:id", deleteSubAdminRole);

module.exports = router;
