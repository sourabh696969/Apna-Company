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
    status: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const imgSchema = mongoose.Schema(
  {
    contentImg: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
const Img = mongoose.model("Img", imgSchema);

module.exports = {
  Blog,
  Img,
};
