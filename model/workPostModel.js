const mongoose = require("mongoose");

const workPostSchema = mongoose.Schema(
  {
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
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const savedWorkPostSchema = mongoose.Schema(
  {
    workpostData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkPost",
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    }
  },
  {
    timestamps: true,
  }
);

const WorkPost = mongoose.model("WorkPost", workPostSchema);
const SavedWorkPost = mongoose.model("SavedWorkPost", savedWorkPostSchema);

module.exports = {
  WorkPost,
  SavedWorkPost
}
