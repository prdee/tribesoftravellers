const router = require('express').Router();
const Destination = require('../models/Destination');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { type, international } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (international !== undefined) filter.isInternational = international === 'true';
  const data = await Destination.find(filter).sort({ travelers: -1 });
  res.json(data);
});

router.get('/:slug', async (req, res) => {
  const dest = await Destination.findOne({ slug: req.params.slug });
  if (!dest) return res.status(404).json({ message: 'Not found' });
  res.json(dest);
});

router.post('/', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const dest = await Destination.create(req.body);
  res.status(201).json(dest);
});

router.put('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dest);
});

router.delete('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
