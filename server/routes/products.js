const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    const products = await Product.find(filter).populate('seller', 'name email college')
    res.json(products)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller','name email college');
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// CREATE product (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user.id });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE product (only seller)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.seller.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not allowed' });
    await product.deleteOne();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;