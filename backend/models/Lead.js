const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  city: String,
  agencyName: String,
  experience: String,
  status: { type: String, enum: ['new', 'contacted', 'onboarded', 'rejected'], default: 'new' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
