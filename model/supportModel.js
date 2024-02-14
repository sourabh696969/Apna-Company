const mongoose = require('mongoose');

const supportSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    userData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Support', supportSchema);