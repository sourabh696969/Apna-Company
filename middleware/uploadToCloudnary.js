const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDiNARY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      quality: 80,
    },
  });

  const upload = multer({ storage: storage });

  return upload.fields([{ name: folderName, maxCount: 1 }]);
};

module.exports = uploadToCloudinary;
