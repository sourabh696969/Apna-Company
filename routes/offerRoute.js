const express = require("express");
const {
  createOffer,
  deleteOffer,
  updateOffer,
  getOfferById,
  getOffer,
} = require("../controllers/offerController");
const uploadToCloudinary = require("../middleware/uploadToCloudnary");

const router = express.Router();

///// POST Routes /////
router.post("/create", uploadToCloudinary("offerImg"), createOffer);

///// PUT Routes /////
router.put("/:id", uploadToCloudinary("offerImg"), updateOffer);

///// GET Routes /////
router.get("/all", getOffer);
router.get("/:id", getOfferById);

///// DELETE Routes /////
router.delete("/:id", deleteOffer);

module.exports = router;
