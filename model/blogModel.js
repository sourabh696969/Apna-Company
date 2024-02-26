const mongooose = require("mongoose");

const blogSchema = mongooose.Schema(
  {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    images: {
      type: String,
    },
    contentImg: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("Blog", blogSchema);
