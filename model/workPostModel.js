const mongoose = require("mongoose");

const workPost = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkPost", workPost);
