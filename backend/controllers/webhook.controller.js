const { finalizeOrder } = require("../utility/order.service");

/**
 * Handle incoming Flutterwave webhook notifications.
 * verified by the SECRET_HASH header to ensure it's actually from Flutterwave.
 */
exports.flutterwaveWebhook = async (req, res) => {
    try {
        // 1. Validate the secret hash to ensure this request is from Flutterwave
        const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
        const signature = req.headers["verif-hash"];

        if (!signature || signature !== secretHash) {
            console.warn("Unauthorized Webhook Attempt detected.");
            return res.status(401).send("Invalid signature");
        }

        const payload = req.body;

        // 2. Only process successful charge events
        if (payload.event !== "charge.completed") {
            return res.status(200).send("Event ignored");
        }

        const { status, tx_ref, id: transactionId } = payload.data;

        // 3. Filter by application prefix
        // If you use one Flutterwave account for multiple apps, 
        // this backend should only process its own transactions.
        if (!tx_ref || !tx_ref.startsWith("pc_")) {
            return res.status(200).send("Event ignored: Not a PosterClone transaction");
        }

        if (status !== "successful") {
            return res.status(200).send("Transaction not successful");
        }

        // 4. Finalize the order using the shared service (idempotent)
        const { alreadyProcessed, order } = await finalizeOrder({
            transactionId,
            tx_ref
        });

        if (alreadyProcessed) {
            console.log(`[Webhook] Order ${tx_ref} was already processed successfully.`);
        } else {
            console.log(`[Webhook] Order ${tx_ref} finalized via webhook.`);
        }

        // Always return 200 to acknowledge receipt
        res.status(200).send("Webhook processed successfully");
    } catch (error) {
        console.error("Webhook Handler Error:", error);
        res.status(500).send("Internal server error");
    }
};
