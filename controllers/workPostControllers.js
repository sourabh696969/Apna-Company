const asyncHandler = require("express-async-handler");
const WorkPost = require("../model/workPostModel");
const User = require("../model/userModel");

const createWorkPost = asyncHandler(async (req, res) => {
  const { title, description, work, duration } = req.body;
  const user = req.user;

  if ((!title, !description, !work, !duration)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.create({
    title,
    description,
    work,
    user,
    duration,
  });
  if (workpost) {
    res.status(201).json({ message: "Work Post Created!", workpost });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const updateWorkPost = asyncHandler(async (req, res) => {
  const { title, description, work, duration } = req.body;
  const postId = req.params.id;

  if ((!title, !description, !work, !duration)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.findByIdAndUpdate(postId, {
    title,
    description,
    work,
    duration
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
    .populate("work", "categoryName categoryImg")
    .skip(skip)
    .limit(limits);

  if (!post || post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post) {
    res.status(200).json({ post });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getSingleWorkPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const post = await WorkPost.findById(postId)
    .populate("user", "phone username address")
    .populate("work", "categoryName categoryImg");

  if (!post || post.length === 0) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post) {
    res.status(200).json( post );
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const getWorkPostByWork = asyncHandler(async (req, res) => {
  const workId = req.params.id;
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page);
  const limits = Number(limit) || 20;
  const skip = (pages - 1) * limits;

  const post = await WorkPost.find({
    work: workId,
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
  })
    .populate("user", "phone username address")
    .populate("work", "categoryName categoryImg")
    .skip(skip)
    .limit(limits);

  if (!post) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (post || post.length === 0) {
    res.status(200).json({ post });
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
    .populate("work", "categoryName categoryImg")
    .skip(skip)
    .limit(limits);

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

module.exports = {
  createWorkPost,
  updateWorkPost,
  getWorkPostById,
  getWorkPostByWork,
  getAllWorkPost,
  getSingleWorkPost,
  deleteWorkPost,
};
