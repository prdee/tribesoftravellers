const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  photoURL: String,
  role: { type: String, enum: ['user', 'agent', 'admin', 'superadmin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
