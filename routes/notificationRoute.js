const express = require("express");
const {
  getUnreadNotification,
  getReadNotification,
  updateNotificationStatus,
  deleteNotificationById,
  deleteUnreadNotification,
  getAppUnreadNotificationUser,
  getAppReadNotificationUser,
  getSingleAppNotificationUser,
  getAppUnreadNotificationWorker,
  getAppReadNotificationWorker,
  getSingleAppNotificationWorker,
} = require("../controllers/notificationController");

const router = express.Router();

///// PATCH Routes /////
router.patch("/update/:id", updateNotificationStatus);

///// GET Routes /////
router.get("/unread", getUnreadNotification);
router.get("/read", getReadNotification);

///// Delete Routes /////
router.delete("/delete/:id", deleteNotificationById);
router.delete("/read", deleteUnreadNotification);

///// In App Notification Route For User /////

///// GET Routes /////
router.get("/user/unreadNotification/:id", getAppUnreadNotificationUser);
router.get("/user/readNotification/:id", getAppReadNotificationUser);
router.get("/user/singleNotification/:id", getSingleAppNotificationUser);

///// In App Notification Route For Worker /////

///// GET Routes /////
router.get("/worker/unreadNotification/:id", getAppUnreadNotificationWorker);
router.get("/worker/readNotification/:id", getAppReadNotificationWorker);
router.get("/worker/singleNotification/:id", getSingleAppNotificationWorker);

module.exports = router;
