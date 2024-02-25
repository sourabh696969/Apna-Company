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
  updateInAppNotificationStatusUser,
  updateInAppNotificationStatusWorker,
  deleteSingleInAppNotificationWorker,
  deleteSingleInAppNotificationUser,
} = require("../controllers/notificationController");

const router = express.Router();

///// Admin Notification Routes /////

///// PATCH Routes /////
router.patch("/update/:id", updateNotificationStatus);
router.patch("/user/updateNotification/:id", updateInAppNotificationStatusUser);
router.patch(
  "/worker/updateNotification/:id",
  updateInAppNotificationStatusWorker
);

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

///// Delete Routes /////
router.delete("/user/delete/:id", deleteSingleInAppNotificationUser);

///// In App Notification Route For Worker /////

///// GET Routes /////
router.get("/worker/unreadNotification/:id", getAppUnreadNotificationWorker);
router.get("/worker/readNotification/:id", getAppReadNotificationWorker);
router.get("/worker/singleNotification/:id", getSingleAppNotificationWorker);

///// Delete Routes /////
router.delete("/worker/delete/:id", deleteSingleInAppNotificationWorker);

module.exports = router;
