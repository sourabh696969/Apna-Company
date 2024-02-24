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
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pincode: {
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
    subAdminData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdmin",
    },
    createdBy: {
      type: String,
      default: "worker",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Worker", userSchema);
