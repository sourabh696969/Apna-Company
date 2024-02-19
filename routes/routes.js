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

module.exports = router;
