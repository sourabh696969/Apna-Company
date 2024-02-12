const asyncHandler = require("express-async-handler");
const WorkPost = require("../model/workPostModel");

const createWorkPost = asyncHandler(async (req, res) => {
    const { title, description, work } = req.body;
    const postId = req.user;

    if (!title, !description, !work) {
        res.status(404);
        throw new Error('All Fields required!');
    }

    const workpost = await WorkPost.create({
        title,
        description,
        work,
        agent: postId
    })
    if (workpost) {
        res.status(201).json({ message: 'Work Post Created!', workpost });
    } else {
        res.status(400);
        throw new Error('data is not valid!');
    }
});

const updateWorkPost = asyncHandler(async (req, res) => {
    const { title, description, work } = req.body;
    const postId = req.params.id;

    if (!title, !description, !work) {
        res.status(404);
        throw new Error('All Fields required!');
    }

    const workpost = await WorkPost.findByIdAndUpdate(postId, {
        title,
        description,
        work,
    });

    if (!workpost) {
        res.status(404);
        throw new Error('Post not found!');
    }
    if (workpost) {
        res.status(201).json({ message: 'Work Post Updated!', workpost });
    } else {
        res.status(400);
        throw new Error('data is not valid!');
    }
});

const getWorkPostById = asyncHandler(async(req, res) => {
    const postId = req.user;

    const post = await WorkPost.find({ agent: postId }).populate('user', 'phone username').populate('work', 'categoryName categoryImg');

    if (!post) {
        res.status(404);
        throw new Error('Post not found!');
    }

    if (post) {
        res.status(200).json({ post });
    } else {
        res.status(400);
        throw new Error('data is not valid!');
    }
});

const getWorkPostByWork = asyncHandler(async(req, res) => {
    const workId = req.params.id;

    const post = await WorkPost.find({ work: workId }).populate('user', 'phone username').populate('work', 'categoryName categoryImg');

    if (!post) {
        res.status(404);
        throw new Error('Post not found!');
    }

    if (post) {
        res.status(200).json({ post });
    } else {
        res.status(400);
        throw new Error('data is not valid!');
    }
});

module.exports = {
    createWorkPost,
    updateWorkPost,
    getWorkPostById,
    getWorkPostByWork,
}