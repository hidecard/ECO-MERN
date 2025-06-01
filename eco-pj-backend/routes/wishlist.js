const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('items.productId');
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
    }
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
    }
    await wishlist.populate('items.productId');
    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(item => item.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('items.productId');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;