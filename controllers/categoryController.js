const express = require("express");
const asyncHandler = require("express-async-handler");
const Category = require("../model/categoryModel");
const Role = require("../model/roleModel");

///// Category Controllers /////
const createCategory = asyncHandler(async (req, res) => {
  const { categoryName, categoryNameHindi } = req.body;

  if ((!categoryName, !categoryNameHindi)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const catAvailable = await Category.findOne({ categoryName });

  if (catAvailable) {
    res.status(400);
    throw new Error("Category already exists!");
  }
  const images = req.files["categoryImg"]
    ? req.files["categoryImg"][0].path
    : null;

  const category = await Category.create({
    categoryName,
    categoryNameHindi,
    categoryImg: images,
  });

  if (category) {
    res.status(201).json({
      message: "New Category created!",
      category,
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

const getSingleCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;

  const category = await Category.findById(catId);
  if (!category) {
    res.status(404);
    throw new Error("category not found!");
  }
  res.status(200).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const catId = req.params.id;
  const { categoryName, categoryNameHindi } = req.body;

  if ((!categoryName, !categoryNameHindi)) {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const images = req.files["categoryImg"]
    ? req.files["categoryImg"][0].path
    : null;

  const categoryData = await Category.findById(catId);

  const updateCategory = await Category.findByIdAndUpdate(catId, {
    categoryName,
    categoryNameHindi,
    categoryImg: images == null ? categoryData.categoryImg : images,
  });

  if (!updateCategory) {
    res.status(404);
    throw new Error("Category not found!");
  }
  res.status(200).json({ message: "Category Updated successfully!" });
});

///// Role Controllers /////
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

const updateRoleStatus = asyncHandler(async (req, res) => {
  const roleId = req.params.id;
  const { status } = req.body;

  if (status === undefined || status === null || status === "") {
    res.status(404);
    throw new Error("All Fields required!");
  }

  const updateRole = await Role.findByIdAndUpdate(roleId, {
    status: status,
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
  getSingleCategory,
  deleteCategory,
  updateCategory,
  createRole,
  getRole,
  deleteRole,
  updateRole,
  updateRoleStatus,
};
