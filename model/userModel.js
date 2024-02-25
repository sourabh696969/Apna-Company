const mongoose = require("mongoose");

const agentSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
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
    status: {
      type: Boolean,
      dafault: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", agentSchema);
