const router = require('express').Router();
const Hotel = require('../models/Hotel');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { state, country, minPrice, maxPrice } = req.query;
  const filter = { isActive: true };
  if (state) filter['location.state'] = new RegExp(state, 'i');
  if (country) filter['location.country'] = new RegExp(country, 'i');
  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }
  const data = await Hotel.find(filter).sort({ rating: -1 });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Not found' });
  res.json(hotel);
});

router.post('/', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const hotel = await Hotel.create(req.body);
  res.status(201).json(hotel);
});

router.put('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(hotel);
});

router.delete('/:id', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
