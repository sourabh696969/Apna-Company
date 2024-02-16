const mongoose = require("mongoose");

const termsConditionSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("termsCondition", termsConditionSchema);
