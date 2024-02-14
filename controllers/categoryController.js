const express = require("express");
const asyncHandler = require("express-async-handler");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");

const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const catAvailable = await Category.findOne({ categoryName });

  if (catAvailable) {
    res.status(400);
    throw new Error("Category already exists!");
  }
  const images = req.files["categoryImg"] || [];
  if (!images) {
    res.status(404);
    throw new Error("image is required!");
  }

  const category = await Category.create({
    categoryName,
    categoryImg: images.map((file) => file.path),
  });

  if (category) {
    res.status(201).json({
      message: "New Category created!",
      _id: category.id,
      categoryName: category.categoryName,
      categoryImg: images.map((file) => file.path),
    });
  } else {
    res.status(400);
    throw new Error("Agent data is not valid!");
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;
  const category = await Category.findByIdAndDelete(catId);
  res.status(200).json({ message: "Category Deleted successfully!" });
});

const updateCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;
  const { categoryName } = req.body;

  if (!categoryName) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const images = req.files["categoryImg"] || [];

  if (!images) {
    res.status(404);
    throw new Error("image is required!");
  }

  const updateCategory = await Category.findByIdAndUpdate(catId, {
    categoryName,
    categoryImg: images.map((file) => file.path),
  });

  if (!updateCategory) {
    res.status(404);
    throw new Error("Category not found!");
  }
  res.status(200).json({ message: "Category Upddated successfully!" });
});

const createRole = asyncHandler(async (req, res) => {
  const { roleName } = req.body;

  if (!roleName) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const roleAvailable = await Role.findOne({ roleName });

  if (roleAvailable) {
    res.status(400);
    throw new Error("Role already exists!");
  }

  const role = await Role.create({
    roleName,
  });

  if (role) {
    res.status(201).json({ message: "New Role created!", role });
  } else {
    res.status(400);
    throw new Error("Agent data is not valid!");
  }
});

const getRole = asyncHandler(async (req, res) => {
  const roles = await Role.find();

  res.status(200).json(roles);
});

const deleteRole = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const role = await Role.findByIdAndDelete(roleId);
  res.status(200).json({ message: "Role Deleted successfully!" });
});

const updateRole = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const { roleName } = req.body;

  if (!roleName) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const updateRole = await Role.findByIdAndUpdate(roleId, {
    roleName,
  });

  if (!updateRole) {
    res.status(404);
    throw new Error("Role not found!");
  }
  res.status(200).json({ message: "Role Upddated successfully!" });
});

module.exports = {
  createCategory,
  getCategory,
  createRole,
  getRole,
  deleteCategory,
  updateCategory,
  deleteRole,
  updateRole,
};
