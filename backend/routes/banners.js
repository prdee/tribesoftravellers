const router = require('express').Router();
const Banner = require('../models/Banner');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const filter = req.query.active === 'true' ? { isActive: true } : {};
  const data = await Banner.find(filter).sort({ order: 1 });
  res.json(data);
});

router.post('/', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

router.put('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(banner);
});

router.delete('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
