const mongoose = require("mongoose");

const RatingAndReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RatingAndReview", RatingAndReviewSchema);
