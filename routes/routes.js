const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/worker", require("./workerRoutes"));
router.use("/admin", require("./adminRoute"));
router.use("/workpost", require("./workPostRoute"));
router.use("/support", require("./supportRoute"));
router.use("/termsCondition", require("./term&conditionRoute"));
router.use("/offer", require("./offerRoute"));
router.use("/subAdmin", require("./subAdminRoute"));
router.use("/notification", require("./notificationRoute"));
router.use("/blog", require("./blogRoute"));
router.use("/rating", require("./ratingAndReviewRoute"));

module.exports = router;
