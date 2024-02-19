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
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("SubAdmin", subAdminSchema);
