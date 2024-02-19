const asyncHandler = require("express-async-handler");
const SubAdmin = require("../model/subAdminModel");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");
const jwt = require("jsonwebtoken");

const registerSubAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if ((!name, !email, !phone, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const subAdminEmail = await SubAdmin.findOne({ email });

  if (subAdminEmail) {
    res.status(403);
    throw new Error("SubAdmin already exist with this email!");
  }

  const subAdmin = await SubAdmin.create({
    name,
    email,
    phone,
    password,
  });

  res
    .status(401)
    .json({ message: "please wait account under process!", subAdmin });
});

const loginSubAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }
  const subAdminAvailable = await SubAdmin.findOne({
    email: email,
    status: true,
  });

  if (!subAdminAvailable) {
    res.status(404);
    throw new Error("Admin not found or account under process!");
  }

  if (password != subAdminAvailable.password) {
    res.status(404);
    throw new Error("email or password is wrong!");
  }

  const accessToken = jwt.sign(
    {
      user: {
        _id: subAdminAvailable._id,
      },
    },
    process.env.SECRET_KEY
  );
  res.status(200).json({
    message: "Admin logged In successfully!",
    _id: subAdminAvailable._id,
    token: accessToken,
  });
});

const forgotPasswordSubAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }
  const subAdminAvailable = await SubAdmin.findOne({
    email: email,
    status: true,
  });

  if (!subAdminAvailable) {
    res.status(404);
    throw new Error("Admin not found or account under process!");
  }

  if (password == subAdminAvailable.password) {
    res.status(403);
    throw new Error("Please enter new password!");
  }

  if (email == subAdminAvailable.email) {
    const newPassword = await SubAdmin.updateOne({
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
  const image = req.files["profileImg"]
    ? req.files["profileImg"][0].path
    : null;

  if (!userAvailable) {
    const worker = await Worker.create({
      username,
      role,
      category,
      phone,
      address,
      price,
      status: true,
      profileImg: image,
      createdBy: "SubAdmin",
    });
    res.status(201).json({ message: "User Registered!", worker });
  }
});

const AllUser = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const all = await Worker.find({
    createdBy: "SubAdmin",
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .populate("role", "roleName")
    .populate("category", "categoryName categoryImg")
    .skip(skip)
    .limit(limits);
  if (!all || all.length === 0) {
    res.status(400);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

module.exports = {
  registerSubAdmin,
  loginSubAdmin,
  forgotPasswordSubAdmin,
  createWorker,
  AllUser,
};
