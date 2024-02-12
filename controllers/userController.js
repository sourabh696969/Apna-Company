const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

let otp;

//@desc Create User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { username, phone, address } = req.body;

  if ((!username, !phone, !address)) {
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

  userPhone.username = username;
  userPhone.phone = phone;
  userPhone.address = address;

  userPhone.save();

  if (userPhone) {
    res.status(201).json({ message: "Agent Registered!", userPhone });
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
      const user = await User.updateOne({
        phone: phone,
      });
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  }
});

//@desc Login Agent
//@route POST /api/agent/login
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
    throw new Error("Agent data is not valid!");
  }
});

//@desc Verify Agent
//@route POST /api/agent/login
//@access public
const veifyOtp = asyncHandler(async (req, res) => {
  const { phone, Otp } = req.body;

  if ((!phone, !Otp)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const phoneAvalaible = await User.findOne({ phone: phone });

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

//@desc Current Agent
//@route Get /api/agent/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const agentId = req.user;
  const CurrentUser = await User.findById(agentId)
  res.status(200).json(CurrentUser);
});

const getAllUser = asyncHandler(async (req, res) => {
  const allUser = await User.find();
  if (!allUser) {
    res.status(404);
    throw new Error("Users not found!");
  }
  res.status(200).json(allUser);
});

module.exports = {
  currentUser,
  registerUser,
  loginUser,
  veifyOtp,
  signupUser,
  getAllUser
};
