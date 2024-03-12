const asyncHandler = require("express-async-handler");
const Worker = require("../model/workerModel");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const { Notification } = require("../model/notificationModel");
const { SavedWorkPost } = require("../model/workPostModel");
const Role = require("../model/roleModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const validateOTP = require("../helper/validateOtp");
const sendOTP = require("../helper/sendOtp");

const registerUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const {
    username,
    roleId,
    categoryId,
    phone,
    gender,
    age,
    address,
    city,
    state,
    pincode,
    price,
  } = req.body;

  if (
    (!username,
    !roleId,
    !categoryId,
    !phone,
    !gender,
    !age,
    !address,
    !city,
    !state,
    !pincode,
    !price)
  ) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const worker = await Worker.findById(userId._id);
  const userAvailable = await Worker.findOne({ phone });
  const category = await Category.findById(categoryId);
  const role = await Role.findById(roleId);

  if (!worker) {
    return res.status(404).json({
      message: "Worker not found!",
    });
  }
  if (!userAvailable) {
    res.status(400);
    throw new Error("User does not exists!");
  }
  if (!category) {
    res.status(404);
    throw new Error("Category does not exists!");
  }
  if (!role) {
    res.status(404);
    throw new Error("Role does not exists!");
  }
  if (userAvailable.phone !== phone) {
    res.status(404);
    throw new Error("phone number is invalid!");
  }

  const image = req.files["profileImg"]
    ? req.files["profileImg"][0].path
    : null;

  worker.username = username;
  worker.role = role._id;
  worker.category = category._id;
  worker.phone = phone;
  worker.gender = gender;
  worker.age = age;
  worker.address = address;
  worker.city = city;
  worker.state = state;
  worker.pincode = pincode;
  worker.price = price;
  worker.status = true;
  worker.profileImg = image;

  worker.save();

  if (worker) {
    res.status(201).json({ message: "User Registered!", worker });
    await Notification.create({
      notification: `${username} !! New Worker registered.`,
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

  const userAvailable = await Worker.findOneAndUpdate(
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

  const userAvailable = await Worker.findOne({ phone: phone });

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

  const loginUser = await Worker.findOneAndUpdate(
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

  const phoneAvalaible = await Worker.findOne({ phone, otp: Otp });

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

  const phoneAvalaible = await Worker.findOne({ phone });

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
  const singleUser = await Worker.findById(userId)
    .select("-otp -otpExpiration")
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg");
  if (!singleUser) {
    res.status(404);
    throw new Error("Users not found!");
  }
  res.status(200).json(singleUser);
});

const AllUser = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const all = await Worker.find({
    status: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .select("-otp -otpExpiration")
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!all) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

const AllUserByLocation = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const userId = req.user;
  const userData = await User.findById(userId);

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const allWithMatchingLocation = await Worker.find({
    status: true,
    isAvailable: true,
    city: userData.city,
    state: userData.state,
    pincode: userData.pincode,
  })
    .select("-otp -otpExpiration")
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const allWithDifferentLocation = await Worker.find({
    status: true,
    isAvailable: true,
    $or: [
      { city: { $ne: userData.city } },
      { state: { $ne: userData.state } },
      { pincode: { $ne: userData.pincode } },
    ],
  })
    .select("-otp -otpExpiration")
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const all = allWithMatchingLocation.concat(allWithDifferentLocation);
  if (!all) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

const searchUser = asyncHandler(async (req, res) => {
  const { searchQuary } = req.query;

  const data = await Worker.find({
    status: true,
    isAvailable: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .select("-otp -otpExpiration")
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg");

  if (!data) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(data);
});

const AllUserById = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { page, limit, searchQuary } = req.query;
  const categoryId = req.params.id;

  const userData = await User.findById(userId);

  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  const matchingWorkers = await Worker.find({
    category: categoryId,
    status: true,
    isAvailable: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
    city: userData.city,
    state: userData.state,
    pincode: userData.pincode,
  })
    .select("-otp -otpExpiration")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });

  const otherWorkers = await Worker.find({
    category: categoryId,
    status: true,
    isAvailable: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
    $or: [
      { city: { $ne: userData.city } },
      { state: { $ne: userData.state } },
      { pincode: { $ne: userData.pincode } },
    ],
  })
    .select("-otp -otpExpiration")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });

  const data = matchingWorkers.concat(otherWorkers);
  if (!data) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(data);
});

const AllUserByRole = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;
  const userId = req.user;
  const userData = await User.findById(userId);

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const dataWithMatchingLocation = await Worker.find({
    category: req.params.catid,
    role: req.params.roleid,
    status: true,
    isAvailable: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
    city: userData.city,
    state: userData.state,
    pincode: userData.pincode,
  })
    .select("-otp -otpExpiration")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const dataWithDifferentLocation = await Worker.find({
    category: req.params.catid,
    role: req.params.roleid,
    status: true,
    isAvailable: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
    $or: [
      { city: { $ne: userData.city } },
      { state: { $ne: userData.state } },
      { pincode: { $ne: userData.pincode } },
    ],
  })
    .select("-otp -otpExpiration")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const data = dataWithMatchingLocation.concat(dataWithDifferentLocation);
  if (!data) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(data);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await Worker.findByIdAndDelete(userId);
  if (!user) {
    res.status(404);
    throw new Error("Users not found!");
  }

  await SavedWorkPost.deleteMany({ worker: userId });
  res.status(200).json({ message: "User Deleted Successfully!" });
});

const updateWorkerAvailablity = asyncHandler(async (req, res) => {
  const { isAvailable } = req.body;
  const workerId = req.params.id;

  if (isAvailable === undefined || isAvailable === null || isAvailable === "") {
    res.status(404);
    throw new Error("All fields required!");
  }

  const Availablity = await Worker.findByIdAndUpdate(workerId, {
    isAvailable: isAvailable,
  });
  if (!Availablity) {
    res.status(404);
    throw new Error("Worker not found!");
  }

  res.status(200).json({ message: "Availability updated Successfully!" });
});

module.exports = {
  registerUser,
  loginUser,
  veifyOtp,
  getUserById,
  AllUser,
  AllUserById,
  signupUser,
  deleteUser,
  AllUserByRole,
  AllUserByLocation,
  updateWorkerAvailablity,
  searchUser,
  testingOtp,
};
