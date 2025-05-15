const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/auth');

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews); // Returns [] if no reviews, which is valid
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { productId, rating, comment } = req.body;
  try {
    const review = new Review({
      productId,
      userId: req.user.userId,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;