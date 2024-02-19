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

router.post("/userSupport", validateUserToken, createSupportUser);
router.post("/workerSupport", validateUserToken, createSupportWorker);
router.get("/all", getSupport);
router.get("/:id", getSupportById);
router.delete("/:id", deleteSupport);

module.exports = router;
