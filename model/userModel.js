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
    address: {
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
