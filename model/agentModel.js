const mongoose = require('mongoose');

const agentSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);