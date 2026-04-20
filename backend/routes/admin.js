const router = require('express').Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Lead = require('../models/Lead');
const TravelAgent = require('../models/TravelAgent');
const Package = require('../models/Package');
const Destination = require('../models/Destination');
const { auth, requireRole } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalBookings, totalAgents, newLeads, revenue, totalUsers, totalPackages, totalDestinations] = await Promise.all([
      Booking.countDocuments(),
      TravelAgent.countDocuments({ isVerified: true }),
      Lead.countDocuments({ status: 'new', createdAt: { $gte: today } }),
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      User.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Destination.countDocuments(),
    ]);

    res.json({
      totalBookings,
      totalAgents,
      newLeads,
      revenue: revenue[0]?.total || 0,
      totalUsers,
      totalPackages,
      totalDestinations,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User management (superadmin only)
router.get('/users', auth, requireRole('superadmin'), async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/users/:id/role', auth, requireRole('superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify/unverify agent
router.put('/agents/:id/verify', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const agent = await TravelAgent.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    ).populate('userId', 'name email');
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Revenue analytics (monthly breakdown)
router.get('/analytics', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthly = await Booking.aggregate([
      { $match: { status: 'confirmed', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json(monthly);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
