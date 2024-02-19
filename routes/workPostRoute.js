const express = require("express");
const {
  createWorkPost,
  updateWorkPost,
  getWorkPostById,
  getWorkPostByWork,
  getAllWorkPost,
  deleteWorkPost,
  getSingleWorkPost,
  getAllVerifiedWorkPost,
  saveWorkpost,
  deleteSavedWorkPost,
  getSavedWorkPost,
} = require("../controllers/workPostControllers");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/", validateUserToken, createWorkPost);
router.put("/:id", updateWorkPost);
router.get("/", validateUserToken, getWorkPostById);
router.get("/all", getAllWorkPost);
router.get("/verified", getAllVerifiedWorkPost);
router.get("/:id", getWorkPostByWork);
router.delete("/:id", deleteWorkPost);
router.get("/single/:id", getSingleWorkPost);

///// save Work Post /////
router.post("/saveWorkPost", validateUserToken, saveWorkpost);
router.get("/savedWorkPost/:id", getSavedWorkPost);
router.delete("/unsaveWorkPost/:id", deleteSavedWorkPost);


module.exports = router;
