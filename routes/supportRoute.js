const express = require("express");
const {
  createSupport,
  getSupport,
  getSupportById,
  deleteSupport,
} = require("../controllers/supportController");
const { validateUserToken } = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/create", validateUserToken, createSupport);
router.get("/all", getSupport);
router.get("/:id", getSupportById);
router.delete("/:id", deleteSupport);

module.exports = router;
