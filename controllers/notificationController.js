const asyncHandler = require("express-async-handler");
const Notification = require("../model/notificationModel");

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

const deleteNotificationById = asyncHandler(async(req, res) => {
  const notificationId = req.params.id;

  const deleteNotification = await Notification.findByIdAndDelete(notificationId);

  if (!deleteNotification) {
    res.status(404);
    throw new Error("Notification not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

const deleteUnreadNotification = asyncHandler(async(req, res) => {
  const deleteNotification = await Notification.deleteMany({ status: true });

  if (!deleteNotification) {
    res.status(404);
    throw new Error("Notification not found!");
  }

  res.status(200).json({ message: "Notification deleted successfully!" });
});

module.exports = {
  getUnreadNotification,
  getReadNotification,
  updateNotificationStatus,
  deleteNotificationById,
  deleteUnreadNotification,
};
