const express = require("express");
const {
  getUnreadNotification,
  getReadNotification,
  updateNotificationStatus,
  deleteNotificationById,
  deleteUnreadNotification,
} = require("../controllers/notificationController");

const router = express.Router();

///// PATCH Routes /////
router.patch("/update/:id", updateNotificationStatus);

///// GET Routes /////
router.get("/unread", getUnreadNotification);
router.get("/read", getReadNotification);

///// Delete Routes /////
router.delete("/delete/:id", deleteNotificationById);
router.delete("/unRead", deleteUnreadNotification);

module.exports = router;
