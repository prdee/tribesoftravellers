const router = require('express').Router();
const Lead = require('../models/Lead');
const { auth, requireRole } = require('../middleware/auth');

// Public: submit join form
router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Agent: get leads assigned to me — must come before /:id
router.get('/mine', auth, requireRole('agent'), async (req, res) => {
  try {
    const data = await Lead.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all leads
router.get('/', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const data = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update lead (status, assignedTo)
router.put('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete lead
router.delete('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
