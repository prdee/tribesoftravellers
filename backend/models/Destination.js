const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: [String],
  image: String,
  packages: { type: Number, default: 0 },
  startingPrice: Number,
  bestTime: String,
  rating: { type: Number, default: 4.0 },
  travelers: { type: Number, default: 0 },
  description: String,
  isInternational: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
