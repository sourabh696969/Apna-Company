const asyncHandler = require("express-async-handler");
const { WorkPost, SavedWorkPost } = require("../model/workPostModel");
const { Notification } = require("../model/notificationModel");
const User = require("../model/userModel");
const Worker = require("../model/workerModel");
const Category = require("../model/categoryModel");

const createWorkPost = asyncHandler(async (req, res) => {
  const { description, work, duration } = req.body;
  const user = req.user;

  const userData = await User.findById(user);

  if ((!description, !work, !duration)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.create({
    description,
    work,
    user,
    duration,
  });

  setTimeout(async () => {
    await WorkPost.findByIdAndDelete(workpost._id);
  }, duration * 86400000);

  if (workpost) {
    res.status(201).json({ message: "Work Post Created!", workpost });
    await Notification.create({
      notification: `${userData.username} Posted new job!!`,
    });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const updateWorkPost = asyncHandler(async (req, res) => {
  const { description, work } = req.body;
  const postId = req.params.id;

  if ((!description, !work)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.findByIdAndUpdate(postId, {
    description,
    work,
  });

  if (!workpost) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (workpost) {
    res.status(201).json({ message: "Work Post Updated!", workpost });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getWorkPostById = asyncHandler(async (req, res) => {
  const postId = req.user;
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit) || 20;
  const skip = (pages - 1) * limits;

  const post = await WorkPost.find({
    user: postId,
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
  })
    .populate("user", "phone username address")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  if (!post || post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getSingleWorkPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const post = await WorkPost.findById(postId)
    .populate("user", "phone username address")
    .populate("work", "categoryName categoryNameHindi categoryImg");

  if (!post || post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getWorkPostByWork = asyncHandler(async (req, res) => {
  const workId = req.params.id;
  const { page, limit, searchQuary } = req.query;
  const workerId = req.user;

  const workerData = await Worker.findById(workerId);
  const pages = Number(page);
  const limits = Number(limit) || 20;
  const skip = (pages - 1) * limits;

  const postWithMatchingLocation = await WorkPost.find({
    status: true,
    work: workId,
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
            city: workerData.city,
            state: workerData.state,
            pincode: workerData.pincode,
          }).distinct("_id"),
        },
      },
    ],
  })
    .populate("user", "phone username address city state pincode")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const postWithDifferentLocation = await WorkPost.find({
    status: true,
    work: workId,
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
    $or: [
      { "user.city": { $ne: workerData.city } },
      { "user.state": { $ne: workerData.state } },
      { "user.pincode": { $ne: workerData.pincode } },
    ],
  })
    .populate("user", "phone username address city state pincode")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const postMap = new Map();

  [...postWithMatchingLocation, ...postWithDifferentLocation].forEach(
    (postItem) => {
      if (!postMap.has(postItem._id.toString())) {
        postMap.set(postItem._id.toString(), postItem);
      }
    }
  );

  const post = Array.from(postMap.values());

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getAllWorkPost = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const post = await WorkPost.find({
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
  })
    .populate("user", "phone username address")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  if (post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }
  res.status(200).json(post);
});

const getVerifiedWorkPost = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 20;

  const skip = (pages - 1) * limits;

  const all = await WorkPost.find({
    status: true,
    $or: [
      {
        work: {
          $in: await Category.find({
            $or: [
              { categoryName: { $regex: searchQuary, $options: "i" } },
              { categoryNameHindi: { $regex: searchQuary, $options: "i" } },
            ],
          }),
        },
      },
    ],
  })
    .populate("user", "phone username address city state pincode")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  if (all.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }
  res.status(200).json(all);
});

const getAllVerifiedWorkPost = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;
  const workerId = req.user;

  const workerData = await Worker.findById(workerId);

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const allWithMatchingLocation = await WorkPost.find({
    status: true,
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
            city: workerData.city,
            state: workerData.state,
            pincode: workerData.pincode,
          }).distinct("_id"),
        },
      },
    ],
    $or: [
      {
        work: {
          $in: await Category.find({
            $or: [
              { categoryName: { $regex: searchQuary, $options: "i" } },
              { categoryNameHindi: { $regex: searchQuary, $options: "i" } },
            ],
          }),
        },
      },
    ],
  })
    .populate("user", "phone username address city state pincode")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const allWithDifferentLocation = await WorkPost.find({
    status: true,
    $or: [
      {
        user: {
          $in: await User.find({
            $or: [
              { username: { $regex: searchQuary, $options: "i" } },
              { phone: { $regex: searchQuary, $options: "i" } },
            ],
          }).distinct("_id"),
        },
      },
    ],
    $or: [
      {
        work: {
          $in: await Category.find({
            $or: [
              { categoryName: { $regex: searchQuary, $options: "i" } },
              { categoryNameHindi: { $regex: searchQuary, $options: "i" } },
            ],
          }),
        },
      },
    ],
    $or: [
      { "user.city": { $ne: workerData.city } },
      { "user.state": { $ne: workerData.state } },
      { "user.pincode": { $ne: workerData.pincode } },
    ],
  })
    .populate("user", "phone username address city state pincode")
    .populate("work", "categoryName categoryNameHindi categoryImg")
    .skip(skip)
    .limit(limits);

  const postMap = new Map();

  [...allWithMatchingLocation, ...allWithDifferentLocation].forEach(
    (postItem) => {
      if (!postMap.has(postItem._id.toString())) {
        postMap.set(postItem._id.toString(), postItem);
      }
    }
  );

  const post = Array.from(postMap.values());

  if (post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }
  res.status(200).json(post);
});

const deleteWorkPost = asyncHandler(async (req, res) => {
  const workId = req.params.id;

  const deletedPost = await WorkPost.findByIdAndDelete(workId);

  if (!deletedPost) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (deletedPost) {
    res.status(200).json({ message: "Post deleted Successfully!" });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const saveWorkpost = asyncHandler(async (req, res) => {
  const { workPostId } = req.body;
  const workerId = req.user;

  const alreadySaved = await SavedWorkPost.findOne({
    workpostData: workPostId,
  });

  if (alreadySaved) {
    res.status(403);
    throw new Error("WorkPost Already Saved!");
  }

  const saveWorkPost = await SavedWorkPost.create({
    workpostData: workPostId,
    worker: workerId,
  });

  res.status(200).json({ message: "Post Saved Successfully!", saveWorkPost });
});

const getSavedWorkPost = asyncHandler(async (req, res) => {
  const workerId = req.params.id;

  const post = await SavedWorkPost.find({
    worker: workerId,
  }).populate({
    path: "workpostData",
    populate: {
      path: "work",
      select: "categoryName categoryNameHindi",
    },
  });

  await SavedWorkPost.populate(post, {
    path: "workpostData.user",
    select: "username phone",
  });

  if (post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }
  res.status(200).json(post);
});

const deleteSavedWorkPost = asyncHandler(async (req, res) => {
  const savedPostId = req.params.id;

  const deletedPost = await SavedWorkPost.findByIdAndDelete(savedPostId);

  if (!deletedPost) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (deletedPost) {
    res.status(200).json({ message: "Post Unsaved Successfully!" });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

module.exports = {
  createWorkPost,
  updateWorkPost,
  getWorkPostById,
  getWorkPostByWork,
  getAllWorkPost,
  getSingleWorkPost,
  deleteWorkPost,
  getAllVerifiedWorkPost,
  saveWorkpost,
  deleteSavedWorkPost,
  getSavedWorkPost,
  getVerifiedWorkPost
};
