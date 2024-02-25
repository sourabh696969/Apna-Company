const asyncHandler = require('express-async-handler');
const Blog = require('../model/blogModel');

const createBlog = asyncHandler(async(req, res) => {
    const { content } = req.body;

    if (!content) {
        res.status(404);
        throw new Error('All fields Required!');
    }

    const blog = await Blog.create({
        content
    });

  res.status(201).json({ message: "Blog created successfully!" });
});

const updateBlog = asyncHandler(async(req, res) => {
    const { content } = req.body;
    const blogId = req.params.id;

    if (!content) {
        res.status(404);
        throw new Error('All fields Required!');
    }

    const blog = await Blog.findByIdAndUpdate(blogId, {
        content
    });
    
    if (!blog) {
        res.status(404);
        throw new Error('Blog Not Found!');
    }

  res.status(200).json({ message: "Blog created successfully!" });
});

const getAllBlog = asyncHandler(async(req, res) => {
    const blog = await Blog.find();

    if (blog.length == 0) {
        res.status(404);
        throw new Error('Blog Not Found!');
    }

  res.status(200).json(blog);
});

const getBlogById = asyncHandler(async(req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
        res.status(404);
        throw new Error('Blog Not Found!');
    }

  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async(req, res) => {
    const blogId = req.params.id;
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
        res.status(404);
        throw new Error('Blog Not Found!');
    }

  res.status(200).json({ message: 'Blog deleted successfully!' });
});

module.exports = {
    createBlog,
    updateBlog,
    getAllBlog,
    getBlogById,
    deleteBlog
}