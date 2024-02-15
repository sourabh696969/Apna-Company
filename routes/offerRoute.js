const express = require("express");
const {
  createOffer,
  deleteOffer,
  updateOffer,
  getOfferById,
  getOffer,
} = require("../controllers/offerController");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "upload", // Specify the folder in Cloudinary where you want to store the files
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Specify allowed file formats
    //  transformation: [{ width: 150, height: 150, crop: 'limit' }], // Optional: image transformations
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  upload.fields([{ name: "offerImg", maxCount: 1 }]),
  createOffer
);
router.get("/all", getOffer);
router.get("/:id", getOfferById);
router.put(
  "/:id",
  upload.fields([{ name: "offerImg", maxCount: 1 }]),
  updateOffer
);
router.delete("/:id", deleteOffer);

module.exports = router;
