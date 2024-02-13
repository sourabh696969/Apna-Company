const asyncHandler = require("express-async-handler");
const Admin = require("../model/adminModel");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");
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

const forgotPasswordAdmin = asyncHandler(async (req, res) => {
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

  if (password == adminAvailable.password) {
    res.status(403);
    throw new Error("Please enter new password!");
  }

  if (email == adminAvailable.email) {
    const newPassword = await Admin.updateOne({
      password: password,
    });
  }
  res.status(200).json({
    message: "password changed successfully!",
  });
});

const createWorker = asyncHandler(async (req, res) => {
  const { username, roleId, categoryId, phone, address, price } = req.body;

  if ((!username, !roleId, !categoryId, !phone, !address, !price)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const userAvailable = await Worker.findOne({ phone });
  const category = await Category.findById(categoryId);
  const role = await Role.findById(roleId);

  if (!category) {
    res.status(404);
    throw new Error("Category does not exists!");
  }
  if (!role) {
    res.status(404);
    throw new Error("Role does not exists!");
  }
  if (userAvailable) {
    if (phone == userAvailable.phone) {
      res.status(404);
      throw new Error("phone number is already exist!");
    }
  }

  if (!userAvailable) {
    const worker = await Worker.create({
      username,
      role,
      category,
      phone,
      address,
      price,
    });
    res.status(201).json({ message: "User Registered!", worker });
  }
});

module.exports = {
  registerAdmin,
  loginAdmin,
  forgotPasswordAdmin,
  createWorker,
};
