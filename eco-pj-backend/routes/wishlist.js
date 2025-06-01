const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate({
      path: 'items.productId',
      select: 'name price imageURLs categoryId',
      populate: { path: 'categoryId', select: 'name' },
    });
    if (!wishlist) return res.json({ items: [] });
    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

// Add item to wishlist
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
    }
    if (!wishlist.items.some(item => item.productId.toString() === productId)) {
      wishlist.items.push({ productId });
    }
    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.productId',
      select: 'name price imageURLs categoryId',
      populate: { path: 'categoryId', select: 'name' },
    });
    res.status(201).json(populatedWishlist);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(400).json({ message: 'Failed to add to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
    await wishlist.save();
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.productId',
      select: 'name price imageURLs categoryId',
      populate: { path: 'categoryId', select: 'name' },
    });
    res.json(populatedWishlist || { items: [] });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(400).json({ message: 'Failed to remove from wishlist' });
  }
});

module.exports = router;