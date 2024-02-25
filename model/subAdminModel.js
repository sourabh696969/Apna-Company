const mongoose = require("mongoose");

const subAdminSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  subAdminImg: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAdminRole",
    },
  ],
});

module.exports = mongoose.model("SubAdmin", subAdminSchema);
