const mongooose = require("mongoose");

const blogSchema = mongooose.Schema(
  {
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongooose.model("Blog", blogSchema);
