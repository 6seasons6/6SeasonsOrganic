const express = require('express');
const Address = require('../models/Address');
const router = express.Router();

// GET /api/address/:userId - get all addresses for user
router.get('/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/address/:userId - add new address for user
router.post('/:userId', async (req, res) => {
  try {
    const { name, phone, addressLine1, addressLine2, city, state, zip, country } = req.body;
    const address = new Address({
      userId: req.params.userId,
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      country
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: 'Invalid address data' });
  }
});

module.exports = router;
