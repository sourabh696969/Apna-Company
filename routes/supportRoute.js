const express = require("express");
const {
  createSupportUser,
  getSupport,
  getSupportById,
  deleteSupport,
  createSupportWorker,
} = require("../controllers/supportController");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

///// POST Routes /////
router.post("/userSupport", validateUserToken, createSupportUser);
router.post("/workerSupport", validateUserToken, createSupportWorker);

///// GET Routes /////
router.get("/all", getSupport);
router.get("/:id", getSupportById);

///// DELETE Routes /////
router.delete("/:id", deleteSupport);

module.exports = router;
