const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Role", roleSchema);
