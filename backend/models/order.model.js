const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        priceAtPurchase: Number,
        isCustom: { type: Boolean, default: false },
        customImage: String, // URL if custom upload
        frameOptions: {
            hasFrame: { type: Boolean, default: false },
            material: String,
            color: String
        }
    }],
    shippingAddress: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        state: String,
        country: String
    },
    subTotal: Number,
    shippingFee: Number,
    totalAmount: Number,
    payment: {
        method: { type: String, enum: ['card', 'cash_on_delivery'], default: 'card' },
        status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
        transactionId: String,
        tx_ref: String
    },
    status: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
