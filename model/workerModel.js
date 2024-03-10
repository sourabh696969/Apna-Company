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
    gender: {
      type: String,
    },
    age: {
      type: String,
    },
    otp: {
      type: String,
      default: "123456",
    },
    otpExpiration: {
      type: Date,
      default: Date.now,
      get: (otpExpiration) => otpExpiration.getTime(),
      set: (otpExpiration) => new Date(otpExpiration),
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
    isAvailable: {
      type: Boolean,
      default: true,
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
