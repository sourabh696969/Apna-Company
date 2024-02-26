const asyncHandler = require("express-async-handler");
const Blog = require("../model/blogModel");

const createBlog = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const images = req.files["images"] ? req.files["images"][0].path : null;

  const blog = await Blog.create({
    title,
    images,
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
  const blogId = req.params.id;

  const contentImg = req.files["contentImg"] ? req.files["contentImg"][0].path : null;

  const blog = await Blog.findByIdAndUpdate(blogId, {
    contentImg,
  });

  res.status(201).json({ message: "Content Image added successfully!" });
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
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId).select("-images -title -content");

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getAllBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find().select("-content -contentImg");

  if (blog.length == 0) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId).select("-images -title -contentImg");

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
};
