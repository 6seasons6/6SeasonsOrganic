const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// POST /api/newsletter - subscribe email
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    // Save email to DB
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed.' });
    }
    const subscription = new Newsletter({ email });
    await subscription.save();
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
