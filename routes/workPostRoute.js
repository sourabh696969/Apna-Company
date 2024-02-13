const express = require("express");
const {
  createWorkPost,
  updateWorkPost,
  getWorkPostById,
  getWorkPostByWork,
  getAllWorkPost,
} = require("../controllers/workPostControllers");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/", validateUserToken, createWorkPost);
router.put("/:id", updateWorkPost);
router.get("/", validateUserToken, getWorkPostById);
router.get("/all", getAllWorkPost);
router.get("/:id", getWorkPostByWork);

module.exports = router;
