const asyncHandler = require("express-async-handler");
const Admin = require("../model/adminModel");
const jwt = require("jsonwebtoken");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const adminEmail = await Admin.findOne({ email });

  if (adminEmail) {
    res.status(403);
    throw new Error("Admin already exist with this email!");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  res.status(401).json({ message: "Admin Registered!", admin });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }
  const adminAvailable = await Admin.findOne({ email });
  if (!adminAvailable) {
    res.status(404);
    throw new Error("Admin not found!");
  }

  if (password != adminAvailable.password) {
    res.status(404);
    throw new Error("email or password is wrong!");
  }

  const accessToken = jwt.sign(
    {
      user: {
        _id: adminAvailable._id,
      },
    },
    process.env.SECRET_KEY
  );
  res.status(200).json({
    message: "Admin logged In successfully!",
    token: accessToken,
  });
});

module.exports = {
  registerAdmin,
  loginAdmin,
};
