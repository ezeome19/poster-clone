const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Transaction = require("../models/transaction.model");
const { generatePaymentLink, verifyPayment } = require("../utility/flutterwave");

// Initialize checkout — creates a temporary transaction record
exports.checkout = async (req, res) => {
    try {
        const { products, shippingAddress, shippingFee, paymentMethod } = req.body;

        if (paymentMethod !== 'card') {
            // Placeholder for direct order (e.g., COD)
            const order = new Order({ ...req.body, status: 'processing' });
            await order.save();
            return res.status(201).send(order);
        }

        if (!products || !products.length) return res.status(400).send("No products provided.");

        const productsWithPrice = await Promise.all(products.map(async (item) => {
            if (item.externalImageUrl) {
                return {
                    quantity: item.quantity || 1,
                    priceAtPurchase: item.priceAtPurchase,
                    isCustom: true,
                    externalImageUrl: item.externalImageUrl,
                    imageSource: item.imageSource || 'external',
                    productType: item.productType || 'Poster',
                    frameOptions: item.frameOptions
                };
            }

            const product = await Product.findById(item.product);
            if (!product) throw new Error("Product not found");
            return {
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price,
                frameOptions: item.frameOptions
            };
        }));

        const subTotal = productsWithPrice.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);
        const totalAmount = subTotal + (shippingFee || 0);

        const tx_ref = `pc_${Date.now()}`;

        // Create a transaction record to hold the order data until payment is verified
        await Transaction.create({
            tx_ref,
            orderData: { products: productsWithPrice, shippingAddress, subTotal, shippingFee, totalAmount },
            status: 'pending'
        });

        // We return the info needed for the inline modal or redirect
        res.status(200).send({
            tx_ref,
            amount: totalAmount,
            customer: {
                email: shippingAddress.email,
                name: shippingAddress.fullName,
                phone: shippingAddress.phone || ""
            }
        });
    } catch (error) {
        console.error("Checkout Initialization Failed:", error);
        res.status(500).send(error.message);
    }
};

const { finalizeOrder } = require("../utility/order.service");

// Verify the payment and convert transaction to a final order
exports.verifyOrder = async (req, res) => {
    try {
        const { transaction_id } = req.body;
        if (!transaction_id) return res.status(400).send("Transaction ID is required.");

        const verificationData = await verifyPayment(transaction_id);

        if (!verificationData || verificationData.status !== "successful") {
            return res.status(400).send("Payment verification failed.");
        }

        // Finalize using the shared service (handles idempotency)
        const { alreadyProcessed, order } = await finalizeOrder({
            transactionId: transaction_id,
            tx_ref: verificationData.tx_ref
        });

        if (alreadyProcessed) {
            return res.status(200).json({ message: "Order already processed", order });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error("Order Verification Failed:", error);
        res.status(500).send(error.message);
    }
};
