const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Transaction = require("../models/transaction.model");
const { generatePaymentLink, verifyPayment } = require("../utility/flutterwave");

exports.checkout = async (req, res) => {
    const { products, shippingAddress, shippingFee, paymentMethod } = req.body;

    if (paymentMethod === 'card') {
        const productsWithPrice = await Promise.all(products.map(async (item) => {
            const product = await Product.findById(item.product);
            return {
                product: product._id,
                quantity: item.quantity,
                priceAtPurchase: product.price,
                frameOptions: item.frameOptions
            };
        }));

        const subTotal = productsWithPrice.reduce((sum, item) => sum + item.quantity * item.priceAtPurchase, 0);
        const totalAmount = subTotal + (shippingFee || 0);

        const tx_ref = `txn_${Date.now()}`;
        await Transaction.create({
            tx_ref,
            orderData: { products: productsWithPrice, shippingAddress, subTotal, shippingFee, totalAmount }
        });

        const paymentLink = await generatePaymentLink({
            amount: totalAmount,
            currency: "NGN",
            email: shippingAddress.email,
            name: shippingAddress.fullName,
            tx_ref,
            redirect_url: `${process.env.FRONTEND_URL}/checkout/verify?tx_ref=${tx_ref}`
        });

        return res.send({ link: paymentLink.link, tx_ref, amount: totalAmount });
    }

    // Handle Cash on Delivery
    const order = new Order({ ...req.body, status: 'processing' });
    await order.save();
    res.send(order);
};

exports.verifyOrder = async (req, res) => {
    const { transaction_id } = req.body;
    const verificationData = await verifyPayment(transaction_id);

    if (!verificationData || verificationData.status !== "successful") {
        return res.status(400).send("Payment verification failed.");
    }

    const transaction = await Transaction.findOne({ tx_ref: verificationData.tx_ref });
    if (!transaction) return res.status(404).send("Transaction not found.");

    const order = new Order({
        ...transaction.orderData,
        payment: {
            method: 'card',
            status: 'successful',
            transactionId: transaction_id,
            tx_ref: verificationData.tx_ref
        }
    });

    await order.save();
    await Transaction.deleteOne({ tx_ref: verificationData.tx_ref });

    res.send(order);
};
