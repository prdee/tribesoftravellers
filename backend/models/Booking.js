const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  travellers: [{ name: String, age: Number, type: { type: String, enum: ['adult', 'child'] } }],
  contactName: String,
  contactPhone: String,
  contactEmail: String,
  travelDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
