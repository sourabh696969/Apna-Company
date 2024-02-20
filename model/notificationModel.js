const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    notification: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', notificationSchema);