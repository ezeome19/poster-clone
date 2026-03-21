const Order = require("../models/order.model");
const Transaction = require("../models/transaction.model");

/**
 * Finalizes an order by converting a temporary Transaction record 
 * into a permanent Order record.
 * 
 * This is designed to be idempotent — it can be called multiple times 
 * (e.g. by the user redirect AND the webhook) and will only create 
 * the order once.
 */
async function finalizeOrder({ transactionId, tx_ref, paymentData }) {
    // 1. Check if the transaction has already been processed successfully
    const transaction = await Transaction.findOne({ tx_ref });
    if (!transaction) throw new Error("Transaction record not found");

    if (transaction.status === "successful") {
        // Find and return the existing order if we already processed this
        const existingOrder = await Order.findOne({ "payment.tx_ref": tx_ref });
        return { alreadyProcessed: true, order: existingOrder };
    }

    // 2. Create the final order from the data stored in the transaction
    const order = new Order({
        ...transaction.orderData,
        payment: {
            method: 'card',
            paid: true,
            status: 'successful',
            transactionId: transactionId || paymentData?.transactionId,
            tx_ref: tx_ref
        },
        status: 'processing'
    });

    await order.save();

    // 3. Mark the transaction as successful so we don't process it again
    transaction.status = "successful";
    await transaction.save();

    return { alreadyProcessed: false, order };
}

module.exports = {
    finalizeOrder
};
