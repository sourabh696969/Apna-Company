const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    notification: {
      type: String,
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

///// In App Notification Schema /////

///// User Schema /////
const appNotificationUserSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    userId: {
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

///// Worker Schema /////
const appNotificationWorkerSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    workerId: {
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

const Notification = mongoose.model("Notification", notificationSchema);
const AppNotificationUser = mongoose.model(
  "AppNotificationUser",
  appNotificationUserSchema
);
const AppNotificationWorker = mongoose.model(
  "AppNotificationWorker",
  appNotificationWorkerSchema
);

module.exports = {
  Notification,
  AppNotificationUser,
  AppNotificationWorker,
};
