const router = require('express').Router();
const Booking = require('../models/Booking');
const { auth, requireRole } = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, userId: req.user.id });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// My bookings (user)
router.get('/mine', auth, async (req, res) => {
  try {
    const data = await Booking.find({ userId: req.user.id })
      .populate('packageId', 'name image price destination')
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agent bookings — must come before /:id
router.get('/agent', auth, requireRole('agent'), async (req, res) => {
  try {
    const data = await Booking.find({ agentId: req.user.id })
      .populate('packageId', 'name image price destination')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: all bookings — must come before /:id
router.get('/', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const data = await Booking.find(filter)
      .populate('packageId', 'name image price destination')
      .populate('userId', 'name email')
      .populate('agentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('packageId', 'name image price destination duration inclusions overview itinerary');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.put('/:id/status', auth, requireRole('agent', 'admin', 'superadmin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
