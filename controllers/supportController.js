const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Worker = require("../model/workerModel");
const Support = require("../model/supportModel");

const createSupportUser = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const userId = req.user;

  if (!description) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const userData = await User.findById(userId);

  if (!userData) {
    res.status(404);
    throw new Error("User not found!");
  }

  const support = await Support.create({
    description,
    userData: userId,
    createdBy: "User",
  });

  res.status(201).json({ message: "Support Created!", support });
});

const createSupportWorker = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const userId = req.user;

  if (!description) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workerData = await Worker.findById(userId);

  if (!workerData) {
    res.status(404);
    throw new Error("Worker not found!");
  }

  const support = await Support.create({
    description,
    userData: userId,
    createdBy: "Worker",
  });

  res.status(201).json({ message: "Support Created!", support });
});

const getSupport = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const supportData = await Support.find({
    $or: [
      {
        userData: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
  })
    .populate("userData", "username phone")
    .skip(skip)
    .limit(limits);

  if (!supportData || supportData.length === 0) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json(supportData);
});

const getSupportById = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const supportData = await Support.findById(supportId).populate(
    "userData",
    "username phone"
  );
  if (!supportData) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json(supportData);
});

const deleteSupport = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const deletedSupport = await Support.findByIdAndDelete(supportId);
  if (!deletedSupport) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json({ message: "Support deleted successfully!" });
});

module.exports = {
  createSupportUser,
  createSupportWorker,
  getSupport,
  getSupportById,
  deleteSupport,
};
