const asyncHandler = require("express-async-handler");
const RatingAndReview = require("../model/ratingAndReviewModel");
const User = require("../model/userModel");
const Worker = require("../model/workerModel");

const createRatingAndReview = asyncHandler(async (req, res) => {
  const user = req.user;
  const { worker, rating, message } = req.body;

  if ((!worker, !rating, !message)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  if (rating < 0 || rating > 5) {
    res.status(400);
    throw new Error("Invalid rating!");
  }

  const userAvailable = await User.findById(user);
  if (!userAvailable) {
    res.status(404);
    throw new Error("User not found!");
  }

  const workerAvailable = await Worker.findById(worker);

  if (!workerAvailable) {
    res.status(404);
    throw new Error("Worker not found!");
  }

  const review = await RatingAndReview.create({
    user,
    worker,
    rating,
    message,
  });

  res.status(201).json({
    message: "Rating and review created successfully",
  });
});

const updateRatingAndReview = asyncHandler(async (req, res) => {
  const ratingId = req.params.id;
  const { rating, message } = req.body;

  if ((!rating, !message)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  if (rating < 0 || rating > 5) {
    res.status(404);
    throw new Error("Invalid rating!");
  }

  const ratingAndReview = await RatingAndReview.findByIdAndUpdate(ratingId, {
    rating,
    message,
  });

  if (!ratingAndReview) {
    res.status(404);
    throw new Error("Rating and review not found");
  }

  res.status(200).json({
    message: "Rating And Review Updated Successfully!",
  });
});

const deleteRatingAndReview = asyncHandler(async (req, res) => {
  const ratingId = req.params.id;
  const ratingAndReview = await RatingAndReview.findByIdAndDelete(ratingId);

  if (!ratingAndReview) {
    res.status(404);
    throw new Error("Rating and review not found");
  }

  res.status(200).json({
    message: "Rating and review not Deleted Successfully",
  });
});

const getAverageWorkerRating = asyncHandler(async (req, res) => {
  const workerId = req.params.id;
  const ratings = await RatingAndReview.find({ worker: workerId });

  if (ratings.length === 0) {
    return res.status(404).json({ error: "No ratings found for the product" });
  }

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);

  const averageRating = (sum / ratings.length).toFixed(1);
  const noOfRatings = ratings.length;

  res.status(200).json({ averageRating, noOfRatings });
});

const getRatingByWorker = asyncHandler(async (req, res) => {
  const workerId = req.params.id;
  const ratings = await RatingAndReview.find({ worker: workerId }).populate(
    "user",
    "username profileImg"
  );

  if (ratings.length === 0) {
    return res.status(404).json({ error: "No ratings found for the product" });
  }

  res.status(200).json(ratings);
});

const getAllRating = asyncHandler(async (req, res) => {
  const ratings = await RatingAndReview.find().populate(
    "worker",
    "username phone address age gender"
  );

  if (ratings.length === 0) {
    return res.status(404).json({ error: "No ratings found for the product" });
  }

  res.status(200).json(ratings);
});

module.exports = {
  createRatingAndReview,
  updateRatingAndReview,
  getAverageWorkerRating,
  deleteRatingAndReview,
  getRatingByWorker,
  getAllRating,
};
