const mongooose = require("mongoose");

const blogSchema = mongooose.Schema(
  {
    content: {
      type: String,
    },
    title: {
      type: String,
    },
    images: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("Blog", blogSchema);
