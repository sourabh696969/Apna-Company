const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    subAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
    },
    images: {
      type: String,
    },
    contentImg: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
