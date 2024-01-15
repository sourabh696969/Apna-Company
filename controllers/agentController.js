const asyncHandler = require("express-async-handler");
const Agent = require("../model/agentModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

let otp;

//@desc Create User
//@route POST /api/user/register
//@access public
const registerAgent = asyncHandler(async (req, res) => {
  const agentId = req.user;
  const { username, phone, address } = req.body;

  if ((!username, !phone, !address)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const agentAvailable = await Agent.findOne({ phone });
  const agentPhone = await Agent.findById(agentId._id);

  if (!agentPhone) {
    return res.status(404).json({
      message: "Agent not found!",
    });
  }
  if (!agentAvailable) {
    res.status(400);
    throw new Error("Agent does not exists!");
  }
  if (agentAvailable.phone !== phone) {
    res.status(404);
    throw new Error("phone number is invalid!");
  }

  agentPhone.username = username;
  agentPhone.phone = phone;
  agentPhone.address = address;

  agentPhone.save();

  if (agentPhone) {
    res.status(201).json({ message: "Agent Registered!", agentPhone });
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

  const agentAvailable = await Agent.findOne({ phone: phone });

  if (!agentAvailable) {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    otp = OTP;

    if (otp) {
      const user = await Agent.create({
        phone: phone,
      });
      res.status(201).json({ message: "OTP send Successfully!", otp: otp });
    } else {
      res.status(400);
      throw new Error("data is not valid");
    }
  } else {
    res.status(404);
    throw new Error("Agent already exist!");
  }
});

//@desc Login Agent
//@route POST /api/agent/login
//@access public
const loginAgent = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const agentAvailable = await Agent.findOne({ phone: phone });

  if (agentAvailable) {
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

  const phoneAvalaible = await Agent.findOne({ phone: phone });

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
      agent: {
        _id: phoneAvalaible._id,
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
  res.status(201).json({
    message: "Agent Verified successfully!",
    phone: phone,
    token: accessToken,
  });
});

//@desc Current Agent
//@route Get /api/agent/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const agentId = req.user;
  const CurrentUser = await Agent.findById(agentId)
  res.status(200).json(CurrentUser);
});

module.exports = {
  currentUser,
  registerAgent,
  loginAgent,
  veifyOtp,
  signupUser
};
