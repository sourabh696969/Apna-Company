const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Worker = require("../model/workerModel");
const { Notification } = require("../model/notificationModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const { WorkPost } = require("../model/workPostModel");
const validateOTP = require("../helper/validateOtp");
const sendOTP = require("../helper/sendOtp");

const registerUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { username, phone, address, city, state, pincode } = req.body;

  if ((!username, !phone, !address, !city, !state, !pincode)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await User.findOne({ phone });
  const userPhone = await User.findById(userId._id);

  if (!userPhone) {
    return res.status(404).json({
      message: "User not found!",
    });
  }
  if (!userAvailable) {
    res.status(400);
    throw new Error("User does not exists!");
  }
  if (userAvailable.phone !== phone) {
    res.status(404);
    throw new Error("phone number is invalid!");
  }
  const image = req.files["profileImg"]
    ? req.files["profileImg"][0].path
    : null;

  userPhone.username = username;
  userPhone.phone = phone;
  userPhone.city = city;
  userPhone.address = address;
  userPhone.state = state;
  userPhone.pincode = pincode;
  userPhone.status = true;
  userPhone.profileImg = image == null ? userPhone.profileImg : image;

  userPhone.save();

  if (userPhone) {
    res.status(201).json({ message: "User Registered!", userPhone });
    await Notification.create({
      notification: `${username} !! New User registered.`,
    });
  } else {
    res.status(400);
    throw new Error("User data is not valid!");
  }
});

const signupUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone.match(/^[6789]\d{9}$/)) {
    res.status(404);
    throw new Error("Invalid mobile number");
  }

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const currentDate = new Date();

  try {
    await sendOTP(phone, otp);
  } catch (error) {
    console.error("Error in userController:", error);
    res.status(500);
    throw new Error("Too many OTP requests. Please try again after some time.");
  }

  const userAvailable = await User.findOneAndUpdate(
    { phone },
    { otp, otpExpiration: new Date(currentDate.getTime()) },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(201).json({ message: "OTP send Successfully!", otp: otp });
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone.match(/^[6789]\d{9}$/)) {
    res.status(404);
    throw new Error("Invalid mobile number");
  }

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await User.findOne({ phone: phone });

  if (!userAvailable) {
    res.status(404);
    throw new Error("User not exist!");
  }
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const currentDate = new Date();

  try {
    await sendOTP(phone, otp);
  } catch (error) {
    console.error("Error in userController:", error);
    res.status(500);
    throw new Error("Too many OTP requests. Please try again after some time.");
  }

  const loginUser = await User.findOneAndUpdate(
    { phone },
    { otp, otpExpiration: new Date(currentDate.getTime()) },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(201).json({ message: "OTP send Successfully!", otp: otp });
});

const veifyOtp = asyncHandler(async (req, res) => {
  const { phone, Otp } = req.body;

  if (!phone.match(/^[6789]\d{9}$/)) {
    res.status(404);
    throw new Error("Invalid mobile number");
  }

  if ((!phone, !Otp)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const phoneAvalaible = await User.findOne({ phone, otp: Otp });

  if (!phoneAvalaible) {
    res.status(400);
    throw new Error("Incorrect OTP!");
  }

  const isOtpExpired = await validateOTP(phoneAvalaible.otpExpiration);
  if (isOtpExpired) {
    res.status(400);
    throw new Error("You OTP has been Expired!");
  }
  const accessToken = jwt.sign(
    {
      user: {
        _id: phoneAvalaible._id,
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );
  res.status(201).json({
    message: "User Verified successfully!",
    phone: phone,
    userId: phoneAvalaible._id,
    token: accessToken,
  });
});

const testingOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  if (phone != 1111111111) {
    res.status(404);
    throw new Error("Invalid mobile number for testing");
  }

  const phoneAvalaible = await User.findOne({ phone });

  if (!phoneAvalaible) {
    res.status(400);
    throw new Error("Incorrect OTP!");
  }

  const accessToken = jwt.sign(
    {
      user: {
        _id: phoneAvalaible._id,
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "30d" }
  );
  res.status(201).json({
    message: "User Verified successfully!",
    phone: phone,
    userId: phoneAvalaible._id,
    token: accessToken,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const singleUser = await User.findById(userId).select("-otp -otpExpiration");
  if (!singleUser) {
    res.status(404);
    throw new Error("Users not found!");
  }
  res.status(200).json(singleUser);
});

const getAllUser = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const allUser = await User.find({
    status: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .select("-otp -otpExpiration")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!allUser || allUser.length === 0) {
    res.status(404);
    throw new Error("Users not found!");
  }
  res.status(200).json(allUser);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    res.status(404);
    throw new Error("Users not found!");
  }
  await WorkPost.deleteMany({ user: userId });

  res.status(200).json({ message: "User Deleted Successfully!" });
});

module.exports = {
  getUserById,
  registerUser,
  loginUser,
  veifyOtp,
  signupUser,
  getAllUser,
  deleteUser,
  testingOtp,
};
