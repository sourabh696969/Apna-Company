const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    username: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    work: {
        cat_Id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        CatName: String,
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);