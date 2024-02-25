const mongoose = require("mongoose");

const subAdminRoleSchema = mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubAdminRole", subAdminRoleSchema);
