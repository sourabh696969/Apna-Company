const asyncHandler = require("express-async-handler");
const {
  Notification,
  AppNotificationUser,
  AppNotificationWorker,
} = require("../model/notificationModel");

///// Notification Controllers for Admin /////
const getUnreadNotification = asyncHandler(async (req, res) => {
  const notificationData = await Notification.find({ status: false });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const getReadNotification = asyncHandler(async (req, res) => {
  const notificationData = await Notification.find({ status: true });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const updateNotificationStatus = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const { status } = req.body;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const updateNotification = await Notification.findByIdAndUpdate(
    notificationId,
    {
      status: status,
    }
  );

  if (!updateNotification) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "Notification updated successfully!" });
});

const deleteNotificationById = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const deleteNotification = await Notification.findByIdAndDelete(
    notificationId
  );

  if (!deleteNotification) {
    res.status(404);
    throw new Error("Notification not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

const deleteUnreadNotification = asyncHandler(async (req, res) => {
  const deleteNotification = await Notification.deleteMany({ status: true });

  if (!deleteNotification) {
    res.status(404);
    throw new Error("Notification not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

///// In App Notifications For User /////
const getAppReadNotificationUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const notificationData = await AppNotificationUser.find({
    status: true,
    userId: userId,
  });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const getAppUnreadNotificationUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const notificationData = await AppNotificationUser.find({
    status: false,
    userId: userId,
  });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const getSingleAppNotificationUser = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const notificationData = await AppNotificationUser.findById(notificationId);

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json(notificationData);
});

const updateInAppNotificationStatusUser = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const { status } = req.body;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const updateNotification = await AppNotificationUser.findByIdAndUpdate(
    notificationId,
    {
      status: status,
    }
  );

  if (!updateNotification) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "Notification updated successfully!" });
});

const deleteSingleInAppNotificationUser = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const deleteNotification = await AppNotificationUser.findByIdAndDelete(
    notificationId
  );

  if (!deleteNotification) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

///// In App Notifications For Worker /////
const getAppReadNotificationWorker = asyncHandler(async (req, res) => {
  const workerId = req.params.id;

  const notificationData = await AppNotificationWorker.find({
    status: true,
    workerId: workerId,
  });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const getAppUnreadNotificationWorker = asyncHandler(async (req, res) => {
  const workerId = req.params.id;

  const notificationData = await AppNotificationWorker.find({
    status: false,
    workerId: workerId,
  });

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res
    .status(200)
    .json({ totalNotification: notificationData.length, notificationData });
});

const getSingleAppNotificationWorker = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const notificationData = await AppNotificationWorker.findById(notificationId);

  if (!notificationData) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json(notificationData);
});

const updateInAppNotificationStatusWorker = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  const { status } = req.body;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const updateNotification = await AppNotificationWorker.findByIdAndUpdate(
    notificationId,
    {
      status: status,
    }
  );

  if (!updateNotification) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "Notification updated successfully!" });
});

const deleteSingleInAppNotificationWorker = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const deleteNotification = await AppNotificationWorker.findByIdAndDelete(
    notificationId
  );

  if (!deleteNotification) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

module.exports = {
  getUnreadNotification,
  getReadNotification,
  updateNotificationStatus,
  deleteNotificationById,
  deleteUnreadNotification,
  getAppReadNotificationUser,
  getAppReadNotificationWorker,
  getAppUnreadNotificationUser,
  getAppUnreadNotificationWorker,
  getSingleAppNotificationUser,
  getSingleAppNotificationWorker,
  updateInAppNotificationStatusUser,
  updateInAppNotificationStatusWorker,
  deleteSingleInAppNotificationUser,
  deleteSingleInAppNotificationWorker,
};
