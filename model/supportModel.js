const mongoose = require("mongoose");

const userSupportSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    userData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const workerSupportSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    workerData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
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

const UserSupport = mongoose.model("UserSupport", userSupportSchema);
const WorkerSupport = mongoose.model("WorkerSupport", workerSupportSchema);

module.exports = {
  UserSupport,
  WorkerSupport,
};
