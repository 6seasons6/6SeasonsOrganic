const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

// GET /api/reviews/:productId - get all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews - add a review
router.post('/', async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;
    const review = new Review({ productId, user, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: 'Invalid review data' });
  }
});

module.exports = router;
