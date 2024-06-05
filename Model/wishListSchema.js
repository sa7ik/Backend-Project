const mongoose = require('mongoose');

const wishListSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserSchema",
        required: true,
        unique: true,
    },
    wishlist: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference the product model correctly
            required: true,
        },
    }],
});

module.exports = mongoose.model("wishListSchema", wishListSchema);
