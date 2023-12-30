const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const Category = require('../model/categoryModel');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

let otp;

//@desc Create User
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, role, work, phone, address, price } = req.body;

    if (!username, !role, !work, !phone, !address, !price) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const userAvailable = await User.findOne({ phone });
    const category = await Category.findOne({ categoryName: work });

    if (userAvailable) {
        res.status(400);
        throw new Error('User already exists!');
    }
    if (!category) {
        res.status(404);
        throw new Error('Work does not exists!');
    }

    const user = await User.create({
        username,
        role,
        work: {
            cat_Id: category._id,
            CatName: category.categoryName
        },
        phone,
        address,
        price
    });

    if (user) {
        res.status(201).json({ message: 'New User created!', user });
    } else {
        res.status(400);
        throw new Error('User data is not valid!');
    }
});

//@desc Login User
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const userAvailable = await User.findOne({ phone });

    if (userAvailable) {
        const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        newotp = OTP;

        if (newotp) {
            res.status(201).json({ message: 'OTP send Successfully!', otp: newotp });
        } else {
            res.status(400);
            throw new Error('data is not valid');
        }
    } else {
        res.status(404);
        throw new Error('User data is not valid!');
    }
});

//@desc Login User
//@route POST /api/user/login
//@access public
const veifyOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone, !otp) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const phoneAvalaible = await User.findOne({ phone });

    if (phoneAvalaible && otp == newotp && phone == phoneAvalaible.phone) {
        const accessToken = jwt.sign({
            user: {
                id: phoneAvalaible.id,
                username: phoneAvalaible.username,
                role: phoneAvalaible.role,
                work: phoneAvalaible.work,
                phone: phoneAvalaible.phone,
                address: phoneAvalaible.address,
                price: phoneAvalaible.price
            }
        },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );
        res.status(201).json({ message: 'User Verified successfully!', phone: phone, token: accessToken });

    } else {
        res.status(400);
        throw new Error('User with this phone number already exists!');
    }
});

//@desc Current User
//@route Get /api/user/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const AllUser = asyncHandler(async (req, res) => {
    const all = await User.find();
    res.status(200).json(all);
});

const AllUserById = asyncHandler(async (req, res) => {
    const data = await User.find({ 'work.cat_Id': req.params.id });
    res.status(200).json(data);
});

module.exports = {
    registerUser,
    loginUser,
    veifyOtp,
    currentUser,
    AllUser,
    AllUserById
};