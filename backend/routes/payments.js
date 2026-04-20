const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

// Lazy-initialize Razorpay so missing keys don't crash on startup
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

// Create order
router.post('/create-order', auth, async (req, res) => {
  const { amount } = req.body; // amount in paise
  const order = await getRazorpay().orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });
  res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
});

// Verify payment & confirm booking
router.post('/verify', auth, async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

  if (expectedSignature !== razorpaySignature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { razorpayOrderId, razorpayPaymentId, status: 'confirmed' },
    { new: true }
  );
  res.json({ success: true, booking });
});

module.exports = router;
