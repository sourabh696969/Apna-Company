const express = require("express");
const {
  createWorkPost,
  updateWorkPost,
  getWorkPostById,
  getWorkPostByWork,
  getAllWorkPost,
  deleteWorkPost,
  getSingleWorkPost,
} = require("../controllers/workPostControllers");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/", validateUserToken, createWorkPost);
router.put("/:id", updateWorkPost);
router.get("/", validateUserToken, getWorkPostById);
router.get("/all", getAllWorkPost);
router.get("/:id", getWorkPostByWork);
router.delete("/:id", deleteWorkPost);
router.get("/single/:id", getSingleWorkPost);

module.exports = router;
