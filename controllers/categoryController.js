const express = require('express');
const asyncHandler = require('express-async-handler');
const Category = require('../model/categoryModel');
const Role = require('../model/roleModel');

//@desc Create Category
//@route POST /api/user/category
//@access private
const createCategory = asyncHandler(async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        res.status(404);
        throw new Error('All Fields required!');
    }

    const catAvailable = await Category.findOne({ categoryName });

    if (catAvailable) {
        res.status(400);
        throw new Error('Category already exists!');
    }
    const images = req.files['categoryImg'] || [];

    const category = await Category.create({
        categoryName,
        categoryImg: images.map(file => file.path)
    });

    if (category) {
        res.status(201).json({ message: 'New Category created!', _id: category.id, categoryName: category.categoryName, categoryImg: images.map(file => file.path) });
    } else {
        res.status(400);
        throw new Error('Agent data is not valid!');
    }
});

//@desc Get Category
//@route GET /api/agent/category
//@access private
const getCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    res.status(200).json(categories);
});

//@desc Create Role
//@route POST /api/other/role
//@access private
const createRole = asyncHandler(async (req, res) => {
    const { roleName } = req.body;

    if (!roleName) {
        res.status(404);
        throw new Error('All Fields required!');
    }

    const roleAvailable = await Role.findOne({ roleName });

    if (roleAvailable) {
        res.status(400);
        throw new Error('Role already exists!');
    }

    const role = await Role.create({
        roleName,
    });

    if (role) {
        res.status(201).json({ message: 'New Role created!', role });
    } else {
        res.status(400);
        throw new Error('Agent data is not valid!');
    }
});

//@desc Get Category
//@route GET /api/other/role
//@access private
const getRole = asyncHandler(async (req, res) => {
    const roles = await Role.find();

    res.status(200).json(roles);
});

module.exports = { createCategory, getCategory, createRole, getRole };