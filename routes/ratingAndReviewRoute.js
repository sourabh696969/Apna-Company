const express = require("express");
const { validateUserToken } = require("../middleware/validateTokenHandler");
const {
  createRatingAndReview,
  updateRatingAndReview,
  getAverageWorkerRating,
  deleteRatingAndReview,
} = require("../controllers/ratingAndReviewController");

const router = express.Router();

///// POST Routes /////
router.post("/create", validateUserToken, createRatingAndReview);

///// PUT Routes /////
router.put("/update/:id", updateRatingAndReview);

///// GET Routes /////
router.get("/average/:id", getAverageWorkerRating);

///// DELETE Routes /////
router.delete("/delete/:id", deleteRatingAndReview);

module.exports = router;
