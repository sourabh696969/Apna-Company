const asyncHandler = require("express-async-handler");
const TermCondition = require("../model/term&conditionModel");

const createTermCondition = asyncHandler(async (req, res) => {
  const { description } = req.body;

  if (!description) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const termCondition = await TermCondition.create({
    description,
  });

  res
    .status(201)
    .json({ message: "TermCondition created successfully!", termCondition });
});

const updateTermCondition = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const termConditionId = req.params.id;

  if (!description) {
    res.status(404);
    throw new Error("All fields required!");
  }

  const termCondition = await TermCondition.findByIdAndUpdate(termConditionId, {
    description,
  });

  res
    .status(201)
    .json({ message: "TermCondition Updated successfully!", termCondition });
});

const getTermCondition = asyncHandler(async (req, res) => {
  const termCondition = await TermCondition.find();
  if (!termCondition) {
    res.status(404);
    throw new Error("TermCondition not found!");
  }

  res.status(200).json(termCondition);
});
const getTermConditionById = asyncHandler(async (req, res) => {
  const termConditionId = req.params.id;

  const termCondition = await TermCondition.findById(termConditionId);
  if (!termCondition) {
    res.status(404);
    throw new Error("TermCondition not found!");
  }

  res.status(200).json(termCondition);
});
const deleteTermCondition = asyncHandler(async (req, res) => {
  const termConditionId = req.params.id;

  const termCondition = await TermCondition.findByIdAndDelete(termConditionId);
  if (!termCondition) {
    res.status(404);
    throw new Error("TermCondition not found!");
  }

  res.status(200).json({ message: "TermCondition deleted succesfully!" });
});

module.exports = {
  createTermCondition,
  getTermCondition,
  getTermConditionById,
  updateTermCondition,
  deleteTermCondition,
};
