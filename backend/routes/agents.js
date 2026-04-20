const router = require('express').Router();
const TravelAgent = require('../models/TravelAgent');
const Package = require('../models/Package');
const Coupon = require('../models/Coupon');
const { auth, requireRole } = require('../middleware/auth');

// Get my agent profile
router.get('/profile', auth, requireRole('agent'), async (req, res) => {
  try {
    const agent = await TravelAgent.findOne({ userId: req.user.id });
    res.json(agent || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create/update agent profile
router.put('/profile', auth, requireRole('agent'), async (req, res) => {
  try {
    const agent = await TravelAgent.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { upsert: true, new: true }
    );
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agent packages
router.get('/packages', auth, requireRole('agent'), async (req, res) => {
  try {
    const data = await Package.find({ agentId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Agent coupons
router.get('/coupons', auth, requireRole('agent'), async (req, res) => {
  try {
    const data = await Coupon.find({ agentId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/coupons', auth, requireRole('agent'), async (req, res) => {
  try {
    const coupon = await Coupon.create({ ...req.body, agentId: req.user.id });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/coupons/:id', auth, requireRole('agent'), async (req, res) => {
  try {
    await Coupon.findOneAndDelete({ _id: req.params.id, agentId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: list ALL agents (verified + unverified)
router.get('/all', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const data = await TravelAgent.find().populate('userId', 'name email photoURL').sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: list all verified agents
router.get('/', async (req, res) => {
  try {
    const data = await TravelAgent.find({ isVerified: true }).populate('userId', 'name photoURL');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
