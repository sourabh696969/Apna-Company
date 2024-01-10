const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
    username: {
        type: String,
    },
    role: {
        type: String,
    },
    work: {
        cat_Id: {
            type: mongoose.Schema.Types.ObjectId,
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
    },
    price: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);