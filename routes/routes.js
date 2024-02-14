const express = require('express');
const router = express.Router();

router.use("/user", require("./userRoute"));
router.use("/worker", require("./workerRoutes"));
router.use("/admin", require("./adminRoute"));
router.use("/workpost", require("./workPostRoute"));
router.use("/support", require("./supportRoute"));
router.use("/termsCondition", require("./supportRoute"));

module.exports = router;