const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// Get wishlist for a user
router.get("/:uid", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.uid });
    res.json(wishlist || { userId: req.params.uid, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add item to wishlist
router.post("/:uid", async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.params.uid });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.params.uid, items: [] });
    }
    // Prevent duplicates
    if (!wishlist.items.some(item => item._id === req.body._id)) {
      wishlist.items.push(req.body);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from wishlist
router.delete("/:uid/:itemId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.uid });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item._id !== req.params.itemId);
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
