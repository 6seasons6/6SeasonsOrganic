// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// Use Razorpay test keys from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_8Ic05YIxwCqwyr',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'jbEVfRYdBYikTzelZ3XyTNAz',
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    const options = {
      amount: Math.round(amount), // amount in paise
      currency: currency || 'INR',
      receipt: receipt || 'order_rcptid_11',
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
});

module.exports = router;
