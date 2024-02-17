const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    price: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", userSchema);
