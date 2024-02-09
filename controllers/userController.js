const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

let otp;

//@desc Create User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { username, roleId, categoryId, phone, address, price } = req.body;

  if ((!username, !roleId, !categoryId, !phone, !address, !price)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  // console.log(userId._id)
  const worker = await User.findById(userId._id);
  const userAvailable = await User.findOne({ phone });
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

  worker.username = username;
  worker.role = role._id;
  worker.category = category._id;
  worker.phone = phone;
  worker.address = address;
  worker.price = price;

  worker.save();

  if (worker) {
    res.status(201).json({ message: "User Registered!", worker });
  } else {
    res.status(400);
    throw new Error("User data is not valid!");
  }
});

//@desc Signup User
//@route POST /api/user/signup
//@access public
const signupUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await User.findOne({ phone: phone });

  if (!userAvailable) {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otp = OTP;

    if (otp) {
      const user = await User.create({
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
      const user = await User.update({
        phone: phone,
      });
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  }
});

//@desc Login User
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await User.findOne({ phone: phone });

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

//@desc Verify User
//@route POST /api/user/verify
//@access public
const veifyOtp = asyncHandler(async (req, res) => {
  const { phone, Otp } = req.body;
  console.log(otp);

  if ((!phone, !Otp)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const phoneAvalaible = await User.findOne({ phone });

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
  res.status(201).json({
    message: "User Verified successfully!",
    phone: phone,
    token: accessToken,
  });
});

//@desc Current User
//@route Get /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const CurrentUser = await User.findById(userId)
  res.status(200).json(CurrentUser);
});

const AllUser = asyncHandler(async (req, res) => {
  const all = await User.find().populate('role', 'roleName').populate('category', 'categoryName categoryImg');
  if (!all) {
    res.status(400);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

const AllUserById = asyncHandler(async (req, res) => {
  const data = await User.find({ "category": req.params.id }).populate('role', 'roleName').populate('category', 'categoryName categoryImg');
  if (!data) {
    res.status(400);
    throw new Error("data not found");
  }
  res.status(200).json(data);
});

module.exports = {
  registerUser,
  loginUser,
  veifyOtp,
  currentUser,
  AllUser,
  AllUserById,
  signupUser,
};
