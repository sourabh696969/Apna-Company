const asyncHandler = require("express-async-handler");
const SubAdmin = require("../model/subAdminModel");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");
const SubAdminRole = require("../model/subAdminRolesModel");
const { Notification } = require("../model/notificationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const subAdmin = await SubAdmin.create({
    name,
    email,
    phone,
    password: hashedPassword,
    subAdminImg: null,
  });
  await Notification.create({
    notification: `${name} !! New SubAdmin registered.`,
  });
  res
    .status(200)
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
  }).populate("role", "role");

  if (!subAdminAvailable) {
    res.status(404);
    throw new Error("Admin not found or account under process!");
  }

  if (!(await bcrypt.compare(password, subAdminAvailable.password))) {
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
  const roles = subAdminAvailable.role.map((role) => role.role);
  res.status(200).json({
    message: "Admin logged In successfully!",
    _id: subAdminAvailable._id,
    token: accessToken,
    role: roles,
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

  if (!(await bcrypt.compare(password, subAdminAvailable.password))) {
    res.status(403);
    throw new Error("Please enter new password!");
  }

  const newPasswordHashed = await bcrypt.hash(password, 10);

  if (email == subAdminAvailable.email) {
    const newPassword = await SubAdmin.updateOne({
      password: newPasswordHashed,
    });
  }
  res.status(200).json({
    message: "password changed successfully!",
  });
});

const getSingleSubAdmin = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;

  const subAdmin = await SubAdmin.findById(subAdminId).populate("role", "role");
  if (!subAdmin) {
    res.status(404);
    throw new Error("SubAdmin not found!");
  }
  res.status(200).json(subAdmin);
});

const updateSubAdmin = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const subAdminId = req.params.id;

  if (!name) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const subAdmin = await SubAdmin.findByIdAndUpdate(subAdminId, {
    name,
  });

  if (!subAdmin) {
    res.status(403);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "SubAdmin Updated!" });
});

const addSubAdminImage = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;

  const images = req.files["subAdminImg"]
    ? req.files["subAdminImg"][0].path
    : null;

  if (!images) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const subAdmin = await SubAdmin.findByIdAndUpdate(subAdminId, {
    subAdminImg: images == null ? subAdmin.subAdminImg : images,
  });

  if (!subAdmin) {
    res.status(404);
    throw new Error("data not found!");
  }

  res.status(200).json({ message: "SubAdmin Updated!" });
});

const updateSubAdminRole = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;
  const { role } = req.body;

  const subAdminData = await SubAdmin.findById(subAdminId);

  if (!role) {
    res.status(404);
    throw new Error("All fields required!");
  }

  if (!subAdminData) {
    res.status(404);
    throw new Error("data not found!");
  }
  const rolesToAdd = role.filter(
    (newRole) => !subAdminData.role.includes(newRole)
  );

  if (rolesToAdd.length === 0) {
    res.status(400).json({ message: "Roles already exist!" });
    return;
  }

  subAdminData.role.push(...rolesToAdd);

  await subAdminData.save();
  res.status(200).json({ message: "SubAdmin role updated!" });
});

const removeSubAdminRoles = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;
  const { roles } = req.body;

  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    res.status(400).json({ message: "Please provide roles to delete." });
    return;
  }

  try {
    let subAdminData = await SubAdmin.findById(subAdminId);

    if (!subAdminData) {
      res.status(404).json({ message: "SubAdmin not found." });
      return;
    }

    const originalRoleCount = subAdminData.role.length;

    subAdminData.role = subAdminData.role.filter(
      (roleId) => !roles.includes(roleId.toString())
    );

    subAdminData = await subAdminData.save();

    const newRoleCount = subAdminData.role.length;

    if (newRoleCount === originalRoleCount) {
      res
        .status(404)
        .json({ message: "roles not found in SubAdmin to delete." });
      return;
    }

    res.status(200).json({ message: "Roles deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

///// Roles for SubAdmin /////
const createSubAdminRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const newrole = await SubAdminRole.create({
    role,
  });

  res.status(201).json({ message: "SubAdmin Role created!" });
});

const getSubAdminRole = asyncHandler(async (req, res) => {
  const roles = await SubAdminRole.find();

  if (!roles) {
    res.status(404);
    throw new Error("All fields required!");
  }

  res.status(200).json(roles);
});

const deleteSubAdminRole = asyncHandler(async (req, res) => {
  const roleId = req.params.id;

  const roles = await SubAdminRole.findByIdAndDelete(roleId);

  if (!roles) {
    res.status(404);
    throw new Error("All fields required!");
  }

  res.status(200).json({ message: "Role deleted successfully!" });
});

///// Worker Controllers /////
const createWorker = asyncHandler(async (req, res) => {
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
  const subAdminId = req.user;

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

  const userAvailable = await Worker.findOne({ phone });
  const category = await Category.findById(categoryId);
  const role = await Role.findById(roleId);
  const subAdminAvailable = await SubAdmin.findById(subAdminId);

  if (subAdminAvailable.status == false) {
    res.status(404);
    throw new Error("You do not have access of subadmin!");
  }
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
      gender,
      age,
      address,
      city,
      state,
      pincode,
      price,
      status: true,
      profileImg: image,
      createdBy: "SubAdmin",
      subAdminData: subAdminId,
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
    .select("-otp -otpExpiration")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });
  if (!all || all.length === 0) {
    res.status(400);
    throw new Error("data not found");
  }
  res.status(200).json(all);
});

const updateWorker = asyncHandler(async (req, res) => {
  const userId = req.params.id;
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

  const worker = await Worker.findById(userId);
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
  worker.gender = gender;
  worker.age = age;
  worker.city = city;
  worker.state = state;
  worker.pincode = pincode;
  worker.price = price;
  worker.status = true;
  worker.profileImg = image == null ? worker.profileImg : image;

  worker.save();

  if (worker) {
    res.status(201).json({ message: "Worker Updated!", worker });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

module.exports = {
  registerSubAdmin,
  loginSubAdmin,
  forgotPasswordSubAdmin,
  updateSubAdminRole,
  createWorker,
  AllUser,
  updateWorker,
  getSingleSubAdmin,
  addSubAdminImage,
  updateSubAdmin,
  createSubAdminRole,
  getSubAdminRole,
  deleteSubAdminRole,
  removeSubAdminRoles,
};
