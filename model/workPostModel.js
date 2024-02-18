const mongoose = require("mongoose");

const workPost = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkPost", workPost);
