const mongoose = require('mongoose');

const travelAgentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  agencyName: String,
  logo: String,
  bio: String,
  commissionRate: { type: Number, default: 10 },
  city: String,
  phone: String,
  website: String,
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('TravelAgent', travelAgentSchema);
