require("dotenv").config();
const Razorpay = require("razorpay");
const express = require('express');
const router = express.Router();
const { paymentModel } = require('../models/payment');

// Create a Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create Razorpay order
router.post("/create/orderId", async (req, res) => {
    const options = {
        amount: 5000 * 100,  // Convert to paisa (smallest currency unit)
        currency: "INR",
    };

    try {
        const order = await razorpay.orders.create(options);
        res.send(order);

        // Save payment details in the database
        const newPayment = await paymentModel.create({
            orderId: order.id,
            amount: order.amount / 100,  // Convert back to normal amount
            currency: order.currency,
            status: "pending",
        });
    } catch (error) {
        res.status(500).send("Error creating order");
    }
});

// Route to verify Razorpay payment
router.post("/api/payment/verify", async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        // Load validatePaymentVerification from Razorpay's utility module
        const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');

        // Validate the payment using the Razorpay SDK utility function
        const isValid = validatePaymentVerification(
            { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
            signature,
            secret
        );

        if (isValid) {
            // Find the payment record and update it
            const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
            payment.paymentId = razorpayPaymentId;
            payment.signature = signature;
            payment.status = "completed";
            await payment.save();
            res.json({ status: "success" });
        } else {
            res.status(400).send("Invalid signature");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error verifying payment");
    }
});

module.exports = router;
