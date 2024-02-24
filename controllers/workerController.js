const asyncHandler = require("express-async-handler");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");
const { Notification } = require("../model/notificationModel");
const Role = require("../model/roleModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

let otp;

const registerUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { username, roleId, categoryId, phone, address, city, state, pincode, price } = req.body;

  if ((!username, !roleId, !categoryId, !phone, !address, !city, !state, !pincode, !price)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  // console.log(userId._id)
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

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await Worker.findOne({ phone: phone });

  if (!userAvailable) {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otp = OTP;

    if (otp) {
      const user = await Worker.create({
        phone: phone,
      });
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  } else {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otp = OTP;

    if (otp) {
      const user = await Worker.updateOne({
        phone: phone,
      });
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await Worker.findOne({ phone: phone });

  if (userAvailable) {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otp = OTP;

    if (otp) {
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  } else {
    res.status(404);
    throw new Error("User data is not valid!");
  }
});

const veifyOtp = asyncHandler(async (req, res) => {
  const { phone, Otp } = req.body;
  console.log(otp);

  if ((!phone, !Otp)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const phoneAvalaible = await Worker.findOne({ phone });

  if (!phoneAvalaible) {
    res.status(400);
    throw new Error("User with this phone number does not exists!");
  }

  if (otp != Otp) {
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
    { expiresIn: "1d" }
  );

  if (!accessToken) {
    res.status(500);
    throw new Error("Server Error!");
  }

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
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!all || all.length === 0) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

const AllUserById = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const data = await Worker.find({
    category: req.params.id,
    status: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!data || data.length === 0) {
    res.status(404);
    throw new Error("data not found");
  }
  res.status(200).json(data);
});

const AllUserByRole = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const data = await Worker.find({
    category: req.params.catid,
    role: req.params.roleid,
    status: true,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!data || data.length === 0) {
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
  res.status(200).json({ message: "User Deleted Successfully!" });
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
};
