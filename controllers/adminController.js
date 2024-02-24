const asyncHandler = require("express-async-handler");
const Admin = require("../model/adminModel");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");
const { WorkPost } = require("../model/workPostModel");
const User = require("../model/userModel");
const { UserSupport, WorkerSupport } = require("../model/supportModel");
const SubAdmin = require("../model/subAdminModel");
const {
  AppNotificationUser,
  AppNotificationWorker,
} = require("../model/notificationModel");

const jwt = require("jsonwebtoken");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ((!name, !email, !password)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const adminEmail = await Admin.findOne({ email });
  const adminCount = await Admin.find();

  if (adminEmail) {
    res.status(403);
    throw new Error("Admin already exist with this email!");
  }

  if (adminCount === 0) {
    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: "Admin Registered!", admin });
  }
  res.status(401).json({ message: "Cannot create more than 1 admin!" });
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
      profileImg: image == null ? userAvailable.profileImg : image,
      createdBy: "Admin",
    });
    res.status(201).json({ message: "User Registered!", worker });
  }
});

const updateWorker = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { username, roleId, phone, categoryId, address, price } = req.body;

  if ((!username, !roleId, !phone, !categoryId, !address, !price)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const worker = await Worker.findById(userId);
  const category = await Category.findById(categoryId);
  const role = await Role.findById(roleId);

  if (!worker) {
    return res.status(404).json({
      message: "Worker not found!",
    });
  }
  if (!category) {
    res.status(404);
    throw new Error("Category does not exists!");
  }
  if (!role) {
    res.status(404);
    throw new Error("Role does not exists!");
  }
  if (worker.phone !== phone) {
    res.status(404);
    throw new Error("phone number is invalid!");
  }
  const image = req.files["profileImg"]
    ? req.files["profileImg"][0].path
    : null;

  worker.username = username;
  worker.role = role._id;
  worker.category = category._id;
  worker.phone = worker.phone;
  worker.address = address;
  worker.price = price;
  worker.profileImg = image == null ? worker.profileImg : image;

  worker.save();

  if (worker) {
    res.status(201).json({ message: "Worker Updated!", worker });
  } else {
    res.status(400);
    throw new Error("Worker data is not valid!");
  }
});

const verifyPosts = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const postId = req.params.id;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const post = await WorkPost.findByIdAndUpdate(postId, {
    status: status,
  });

  if (!post) {
    res.status(404);
    throw new Error("post not found!");
  }

  res.status(201).json({ message: "Post status changed successfully!" });
});

const updateUserSupport = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const supportId = req.params.id;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const supprot = await UserSupport.findByIdAndUpdate(supportId, {
    status: status,
  });

  if (!supprot) {
    res.status(404);
    throw new Error("support not found!");
  }

  res.status(201).json({ message: "Support status changed successfully!" });
});

const updateWorkerSupport = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const supportId = req.params.id;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const supprot = await WorkerSupport.findByIdAndUpdate(supportId, {
    status: status,
  });

  if (!supprot) {
    res.status(404);
    throw new Error("support not found!");
  }

  res.status(201).json({ message: "Support status changed successfully!" });
});

const verifySubAdmin = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const subAdminId = req.params.id;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const subAdmin = await SubAdmin.findByIdAndUpdate(subAdminId, {
    status: status,
  });

  if (!subAdmin) {
    res.status(404);
    throw new Error("SubAdmin not found!");
  }

  res.status(201).json({ message: "SubAdmin status changed successfully!" });
});

const getLengthOfData = asyncHandler(async (req, res) => {
  const allWorker = await Worker.find({ status: true }).count();
  const allUser = await User.find({ status: true }).count();
  const allWorkPost = await WorkPost.find().count();
  const userSupport = await UserSupport.find().count();
  const workerSupport = await WorkerSupport.find().count();
  const allCategory = await Category.find().count();
  const allRole = await Role.find().count();
  const allSubAdmin = await SubAdmin.find().count();

  res.status(200).json({
    UserCount: allUser,
    WorkerCount: allWorker,
    UserSupportCount: userSupport,
    WorkerSupportCount: workerSupport,
    WorkPostCount: allWorkPost,
    CategoryCount: allCategory,
    RoleCount: allRole,
    SubAdminCount: allSubAdmin,
  });
});

const deleteSubAdmin = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;
  const subAdmin = await SubAdmin.findByIdAndDelete(subAdminId);
  if (!subAdmin) {
    res.status(404);
    throw new Error("SubAdmin not found!");
  }
  res.status(200).json({ message: "SubAdmin Deleted Successfully!" });
});

const getAllSubAdmin = asyncHandler(async (req, res) => {
  const subAdmin = await SubAdmin.find({}, "-password").sort({ updatedAt: -1 });
  if (!subAdmin) {
    res.status(404);
    throw new Error("SubAdmin not found!");
  }
  res.status(200).json(subAdmin);
});

const getWorkerBySubAdminId = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const subAdmin = await Worker.find({
    subAdminData: subAdminId,
    $or: [
      { username: { $regex: searchQuary, $options: "i" } },
      { phone: { $regex: searchQuary, $options: "i" } },
      { address: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .populate("subAdminData", "name phone email")
    .populate("role", "roleName")
    .populate("category", "categoryName categoryNameHindi categoryImg")
    .sort({ updatedAt: -1 });
  if (!subAdmin) {
    res.status(404);
    throw new Error("SubAdmin not found!");
  }
  res.status(200).json(subAdmin);
});

const createAppNotificationUser = asyncHandler(async (req, res) => {
  const { title, description, userId } = req.body;

  if ((!title, !description, !userId)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const notification = await AppNotificationUser.create({
    title,
    description,
    userId,
  });
  res.status(201).json({ message: "Notification created successfully!" });
});

const createAppNotificationWorker = asyncHandler(async (req, res) => {
  const { title, description, workerId } = req.body;

  if ((!title, !description, !workerId)) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const notification = await AppNotificationWorker.create({
    title,
    description,
    workerId,
  });
  res.status(201).json({ message: "Notification created successfully!" });
});

const createAppNotificationForAllUsers = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required!");
  }

  const userIds = await User.find().distinct("_id"); // Assuming User is your mongoose model for users

  const notifications = await Promise.all(
    userIds.map(async (userId) => {
      return await AppNotificationUser.create({
        title,
        description,
        userId,
      });
    })
  );

  res
    .status(201)
    .json({ message: "Notifications created successfully!", notifications });
});

const createAppNotificationForAllWorkers = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required!");
  }

  const workerIds = await Worker.find().distinct("_id"); // Assuming User is your mongoose model for users

  const notifications = await Promise.all(
    workerIds.map(async (workerId) => {
      return await AppNotificationWorker.create({
        title,
        description,
        workerId,
      });
    })
  );

  res
    .status(201)
    .json({ message: "Notifications created successfully!", notifications });
});

module.exports = {
  registerAdmin,
  loginAdmin,
  forgotPasswordAdmin,
  createWorker,
  updateWorker,
  verifyPosts,
  updateUserSupport,
  updateWorkerSupport,
  getLengthOfData,
  verifySubAdmin,
  deleteSubAdmin,
  getAllSubAdmin,
  getWorkerBySubAdminId,
  createAppNotificationUser,
  createAppNotificationWorker,
  createAppNotificationForAllUsers,
  createAppNotificationForAllWorkers,
};
