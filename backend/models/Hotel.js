const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    address: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
  },
  images: [String],
  pricePerNight: Number,
  rating: { type: Number, default: 4.0 },
  amenities: [String],
  description: String,
  stars: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
