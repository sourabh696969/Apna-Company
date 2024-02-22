const express = require("express");
const {
  createSupportUser,
  createSupportWorker,
  getUserSupport,
  getWorkerSupport,
  getUserSupportById,
  getWorkerSupportById,
  deleteUserSupport,
  deleteWorkerSupport,
} = require("../controllers/supportController");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

///// POST Routes /////
router.post("/userSupport", validateUserToken, createSupportUser);
router.post("/workerSupport", validateUserToken, createSupportWorker);

///// GET Routes /////
router.get("/userSupport", getUserSupport);
router.get("/userSupport/:id", getUserSupportById);
router.get("/workerSupport/:id", getWorkerSupportById);
router.get("/workerSupport", getWorkerSupport);

///// DELETE Routes /////
router.delete("/userSupport/:id", deleteUserSupport);
router.delete("/workerSupport/:id", deleteWorkerSupport);

module.exports = router;
