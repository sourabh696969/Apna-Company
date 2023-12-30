const asyncHandler = require('express-async-handler');
const Agent = require('../model/agentModel');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

let otp;

//@desc Create User
//@route POST /api/user/register
//@access public
const registerAgent = asyncHandler(async (req, res) => {
    const { username, phone, address } = req.body;

    if (!username, !phone, !address) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const agentAvailable = await Agent.findOne({ phone });

    if (agentAvailable) {
        res.status(400);
        throw new Error('Agent already exists!');
    }

    const agent = await Agent.create({
        username,
        phone,
        address
    });

    if (agent) {
        res.status(201).json({ message: 'New Agent created!', _id: agent.id, username: agent.username, phone: agent.phone, address: agent.address });
    } else {
        res.status(400);
        throw new Error('Agent data is not valid!');
    }

    res.status(200).json({ message: 'Agent Registered!' });
});

//@desc Login Agent
//@route POST /api/agent/login
//@access public
const loginAgent = asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const agentAvailable = await Agent.findOne({ phone });

    if (agentAvailable) {
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
        throw new Error('Agent data is not valid!');
    }
});

//@desc Verify Agent
//@route POST /api/agent/login
//@access public
const veifyOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone, !otp) {
        res.status(404);
        throw new Error('All fields required!');
    }

    const phoneAvalaible = await Agent.findOne({ phone });

    if (phoneAvalaible && otp == newotp && phone == phoneAvalaible.phone) {
        const accessToken = jwt.sign({
            agent: {
                id: phoneAvalaible.id,
                username: phoneAvalaible.username,
                phone: phoneAvalaible.phone,
                address: phoneAvalaible.address
            }
        },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );
        res.status(201).json({ message: 'Agent Verified successfully!', phone: phone, token: accessToken });

    } else {
        res.status(400);
        throw new Error('Agent with this phone number already exists!');
    }
});

//@desc Current Agent
//@route Get /api/agent/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    currentUser,
    registerAgent,
    loginAgent,
    veifyOtp
};