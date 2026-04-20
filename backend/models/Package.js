const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  destination: String,
  duration: String,
  nights: Number,
  days: Number,
  price: Number,
  originalPrice: Number,
  inclusions: [String],
  image: String,
  images: [String],
  rating: { type: Number, default: 4.0 },
  reviews: { type: Number, default: 0 },
  tags: [String],
  overview: String,
  itinerary: [{ day: Number, title: String, description: String }],
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
