const router = require('express').Router();
const Package = require('../models/Package');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { destination, days, tags } = req.query;
  const filter = { isActive: true };
  if (destination) filter.destination = new RegExp(destination, 'i');
  if (tags) filter.tags = { $in: tags.split(',') };
  if (days) {
    const [min, max] = days.split('-').map(Number);
    filter.days = max ? { $gte: min, $lte: max } : { $gte: min };
  }
  const data = await Package.find(filter).sort({ rating: -1 });
  res.json(data);
});

router.get('/:slug', async (req, res) => {
  const pkg = await Package.findOne({ slug: req.params.slug });
  if (!pkg) return res.status(404).json({ message: 'Not found' });
  res.json(pkg);
});

router.post('/', auth, requireRole('agent', 'admin', 'superadmin'), async (req, res) => {
  const pkg = await Package.create({ ...req.body, agentId: req.user.id });
  res.status(201).json(pkg);
});

router.put('/:id', auth, requireRole('agent', 'admin', 'superadmin'), async (req, res) => {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(pkg);
});

router.delete('/:id', auth, requireRole('agent', 'admin', 'superadmin'), async (req, res) => {
  await Package.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
