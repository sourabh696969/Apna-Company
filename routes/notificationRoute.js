const express = require("express");
const { getUnreadNotification, getReadNotification, updateNotificationStatus } = require("../controllers/notificationController");

const router = express.Router();

router.get("/unread", getUnreadNotification);
router.get("/read", getReadNotification);
router.patch("/update/:id", updateNotificationStatus);

module.exports = router;
