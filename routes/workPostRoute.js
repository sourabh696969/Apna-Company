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

///// POST Routes /////
router.post("/", validateUserToken, createWorkPost);

///// PUT Routes /////
router.put("/:id", updateWorkPost);

///// GET Routes /////
router.get("/", validateUserToken, getWorkPostById);
router.get("/all", getAllWorkPost);
router.get("/verified", getAllVerifiedWorkPost);
router.get("/:id", getWorkPostByWork);
router.get("/single/:id", getSingleWorkPost);

///// DELETE Routes /////
router.delete("/:id", deleteWorkPost);

///// save Work Post /////
router.post("/saveWorkPost", validateUserToken, saveWorkpost);
router.get("/savedWorkPost/:id", getSavedWorkPost);
router.delete("/unsaveWorkPost/:id", deleteSavedWorkPost);

module.exports = router;
