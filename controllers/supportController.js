const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Worker = require("../model/workerModel");
const { UserSupport, WorkerSupport } = require("../model/supportModel");
const { Notification } = require("../model/notificationModel");

///// User Support /////
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

  const support = await UserSupport.create({
    description,
    userData: userId,
  });

  setTimeout(async () => {
    await UserSupport.findByIdAndDelete(support._id);
  }, 604800000);

  res.status(201).json({ message: "Support Created!", support });
  await Notification.create({
    notification: `Quary raised by U-${userData.username}`,
  });
});

const getUserSupport = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const supportData = await UserSupport.find({
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

const getUserSupportById = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const supportData = await UserSupport.findById(supportId).populate(
    "userData",
    "username phone"
  );
  if (!supportData) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json(supportData);
});

const deleteUserSupport = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const deletedSupport = await UserSupport.findByIdAndDelete(supportId);
  if (!deletedSupport) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json({ message: "Support deleted successfully!" });
});

///// Worker Support /////
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

  const support = await WorkerSupport.create({
    description,
    workerData: userId,
  });

  setTimeout(async () => {
    await WorkerSupport.findByIdAndDelete(support._id);
  }, 604800000);

  res.status(201).json({ message: "Support Created!", support });
  await Notification.create({
    notification: `Quary raised by W-${workerData.username}`,
  });
});

const getWorkerSupport = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const supportData = await WorkerSupport.find({
    $or: [
      {
        workerData: {
          $in: await Worker.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
  })
    .populate("workerData", "username phone")
    .skip(skip)
    .limit(limits);

  if (!supportData || supportData.length === 0) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json(supportData);
});

const getWorkerSupportById = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const supportData = await WorkerSupport.findById(supportId).populate(
    "workerData",
    "username phone"
  );
  if (!supportData) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json(supportData);
});

const deleteWorkerSupport = asyncHandler(async (req, res) => {
  const supportId = req.params.id;
  const deletedSupport = await WorkerSupport.findByIdAndDelete(supportId);
  if (!deletedSupport) {
    res.status(404);
    throw new Error("data not found!");
  }
  res.status(200).json({ message: "Support deleted successfully!" });
});

module.exports = {
  createSupportUser,
  createSupportWorker,
  getUserSupport,
  getWorkerSupport,
  getUserSupportById,
  getWorkerSupportById,
  deleteWorkerSupport,
  deleteUserSupport,
};
