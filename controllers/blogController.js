const asyncHandler = require("express-async-handler");
const { Blog, Img } = require("../model/blogModel");

const createBlog = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const subAdminId = req.user;

  if (!title) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const images = req.files["images"] ? req.files["images"][0].path : null;

  const blog = await Blog.create({
    title,
    images,
    subAdmin: subAdminId,
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json({ message: "Blog created successfully!" });
});

const addBlogContent = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const blogId = req.params.id;

  if (!content) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const blog = await Blog.findByIdAndUpdate(blogId, {
    content,
  });

  res.status(201).json({ message: "Content added successfully!" });
});

const addBlogImage = asyncHandler(async (req, res) => {
  const contentImg = req.files["contentImg"]
    ? req.files["contentImg"][0].path
    : null;

  const blog = await Img.create({
    contentImg,
  });

  res.status(201).json({ message: "Content Image added successfully!", blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const blogId = req.params.id;

  if (!title) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const images = req.files["images"] ? req.files["images"][0].path : null;

  const blog = await Blog.findByIdAndUpdate(blogId, {
    title,
    images,
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json({ message: "Blog updated successfully!" });
});

const getBlogContentImg = asyncHandler(async (req, res) => {
  const blog = await Img.find().sort({ createdAt: -1 });

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const updateBlogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const blogId = req.params.id;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All fields required!");
  }
  const blog = await Blog.findByIdAndUpdate(blogId, {
    status: status,
  });

  if (!blog) {
    res.status(404);
    throw new Error("blog not found!");
  }

  res.status(201).json({ message: "Post status changed successfully!" });
});

const getAllBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find().select("-content -contentImg");

  if (blog.length == 0) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getVerifiedBlog = asyncHandler(async (req, res) => {
  const { page, limit, searchQuary } = req.query;

  const pages = Number(page) || 1;
  const limits = Number(limit) || 10;
  const skip = (pages - 1) * limits;

  const blog = await Blog.find({
    status: true,
    $or: [
      { title: { $regex: searchQuary, $options: "i" } },
      { content: { $regex: searchQuary, $options: "i" } },
    ],
  })
    .select("-content -contentImg")
    .skip(skip)
    .limit(limits)
    .sort({ updatedAt: -1 });

  if (blog.length == 0) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getAllBlogBySubAdmin = asyncHandler(async (req, res) => {
  const subAdminId = req.params.id;

  const blog = await Blog.find({ subAdmin: subAdminId })
    .select("-content -contentImg")
    .populate("subAdmin", "name phone");

  if (blog.length == 0) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId)
    .select("-images -title -contentImg")
    .populate("subAdmin", "name phone");

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findByIdAndDelete(blogId);

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json({ message: "Blog deleted successfully!" });
});

module.exports = {
  createBlog,
  updateBlog,
  getAllBlog,
  getBlogById,
  deleteBlog,
  addBlogContent,
  addBlogImage,
  getBlogContentImg,
  getAllBlogBySubAdmin,
  getVerifiedBlog,
  updateBlogStatus,
};
