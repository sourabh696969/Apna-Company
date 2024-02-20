const express = require("express");
const {
  getUnreadNotification,
  getReadNotification,
  updateNotificationStatus,
} = require("../controllers/notificationController");

const router = express.Router();

///// PATCH Routes /////
router.patch("/update/:id", updateNotificationStatus);

///// GET Routes /////
router.get("/unread", getUnreadNotification);
router.get("/read", getReadNotification);

module.exports = router;
