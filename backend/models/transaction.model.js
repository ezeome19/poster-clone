const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    tx_ref: { type: String, required: true, unique: true },
    orderData: { type: Object, required: true },
    status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // TTL for 1 hour
});

module.exports = mongoose.model('Transaction', transactionSchema);
