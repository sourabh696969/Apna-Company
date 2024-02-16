const asyncHandler = require("express-async-handler");
const WorkPost = require("../model/workPostModel");

const createWorkPost = asyncHandler(async (req, res) => {
  const { title, description, work } = req.body;
  const user = req.user;

  if ((!title, !description, !work)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.create({
    title,
    description,
    work,
    user,
  });
  if (workpost) {
    res.status(201).json({ message: "Work Post Created!", workpost });
  } else {
    res.status(400);
    throw new Error("data is not valid!");
  }
});

const updateWorkPost = asyncHandler(async (req, res) => {
  const { title, description, work } = req.body;
  const postId = req.params.id;

  if ((!title, !description, !work)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const workpost = await WorkPost.findByIdAndUpdate(postId, {
    title,
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
  const { page, limit } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const post = await WorkPost.find({ user: postId })
    .populate("user", "phone username")
    .populate("work", "categoryName categoryImg").skip(skip).limit(limits);

  if (!post) {
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

const getWorkPostByWork = asyncHandler(async (req, res) => {
  const workId = req.params.id;
  const { page, limit } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  const post = await WorkPost.find({ work: workId, status: true })
    .populate("user", "phone username")
    .populate("work", "categoryName categoryImg").skip(skip).limit(limits);

  if (!post) {
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

const getAllWorkPost = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

    const post = await WorkPost.find()
      .populate("user", "phone username")
      .populate("work", "categoryName categoryImg").skip(skip).limit(limits);

    if (post.length === 0) {
      res.status(404);
      throw new Error("Post not found!");
    }
    res.status(200).json({ post });
 
});

const deleteWorkPost = asyncHandler(async (req, res) => {
  const workId = req.params.id;

  const deletedPost = await WorkPost.findByIdAndDelete(workId);

  if (!deletedPost) {
    res.status(404);
    throw new Error("Post not found!");
  }

  if (deletedPost) {
    res.status(200).json({ message: 'Post deleted Successfully!' });
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
  deleteWorkPost,
};
