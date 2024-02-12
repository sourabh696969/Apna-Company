const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    username: {
        type: String,

    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,

    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', agentSchema);