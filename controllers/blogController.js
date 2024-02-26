const asyncHandler = require("express-async-handler");
const Blog = require("../model/blogModel");

const createBlog = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const blog = await Blog.create({
    content,
  });

  res.status(201).json({ message: "Blog created successfully!" });
});

const AddBlogImage = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const blogId = req.params.id;

  if (!title) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  let images = [];
  if (req.files && req.files["images"]) {
    images = req.files["images"].map((file) => file.path);
  }
  const blog = await Blog.findByIdAndUpdate(blogId, {
    title,
    $push: { images: { $each: images } },
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json({ message: "Image and title Added successfully!" });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const blogId = req.params.id;

  if (!content) {
    res.status(404);
    throw new Error("All fields Required!");
  }

  const blog = await Blog.findByIdAndUpdate(blogId, {
    content,
  });

  if (!blog) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json({ message: "Blog updated successfully!" });
});

const getAllBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find().select('-content');

  if (blog.length == 0) {
    res.status(404);
    throw new Error("Blog Not Found!");
  }

  res.status(200).json(blog);
});

const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);

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
  AddBlogImage,
};
