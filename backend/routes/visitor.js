const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Get current visitor count
router.get('/', async (req, res) => {
  let visitor = await Visitor.findOne();
  if (!visitor) {
    visitor = new Visitor({ count: 1098 });
    await visitor.save();
  }
  res.json({ count: visitor.count });
});

// Increment visitor count
router.post('/increment', async (req, res) => {
  let visitor = await Visitor.findOne();
  if (!visitor) {
    visitor = new Visitor({ count: 1098 });
  }
  visitor.count += 1;
  await visitor.save();
  res.json({ count: visitor.count });
});

module.exports = router;
