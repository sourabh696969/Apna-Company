const express = require("express");
const {
  createTermCondition,
  deleteTermCondition,
  updateTermCondition,
  getTermConditionById,
  getTermCondition,
} = require("../controllers/term&conditionController");

const router = express.Router();

///// POST Routes /////
router.post("/create", createTermCondition);

///// PUT Routes /////
router.put("/:id", updateTermCondition);

///// GET Routes /////
router.get("/all", getTermCondition);
router.get("/:id", getTermConditionById);

///// GET Routes /////
router.delete("/:id", deleteTermCondition);

module.exports = router;
