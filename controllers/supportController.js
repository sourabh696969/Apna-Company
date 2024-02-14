const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const Support = require('../model/supportModel');

const createSupport = asyncHandler(async(req, res) => {
    const { description } = req.body;
    const userId = req.user;

    if (!description) {
        res.status(404);
    throw new Error("All Fields required!");
    }

    const userData = await User.findById(userId);

    if (!userData) {
        res.status(404);
    throw new Error("User not found!");
    }

    const support = await Support.create({
        description,
        userData: userId
    });

    res.status(201).json({ message: 'Support Created!', support });
});

const getSupport = asyncHandler(async(req, res) => {
    const supportData = await Support.find().populate('userData', 'username phone');
    if (!supportData) {
        res.status(404);
    throw new Error("data not found!");
    }
    res.status(201).json( supportData );
});

const getSupportById = asyncHandler(async(req, res) => {
    const supportId = req.params.id;
    const supportData = await Support.findById(supportId).populate('userData', 'username phone');
    if (!supportData) {
        res.status(404);
    throw new Error("data not found!");
    }
    res.status(201).json( supportData );
});

const deleteSupport = asyncHandler(async(req, res) => {
    const supportId = req.params.id;
    const deletedSupport = await Support.findByIdAndDelete(supportId);
    if (!deletedSupport) {
        res.status(404);
    throw new Error("data not found!");
    }
    res.status(201).json({ message: 'Support deleted successfully!' });
});

module.exports = {
    createSupport,
    getSupport,
    getSupportById,
    deleteSupport
}