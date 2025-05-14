const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

// Get wishlist (user only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.userId }).populate('productIds');
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, productIds: [] });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist (user only)
router.post('/add', authMiddleware, async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.userId, productIds: [] });
    }
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
    }
    await wishlist.save();
    await wishlist.populate('productIds');
    res.json(wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove from wishlist (user only)
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('productIds');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;