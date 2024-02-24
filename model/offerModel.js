const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
  {
    offerName: {
      type: String,
    },
    offerImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Offer", offerSchema);
