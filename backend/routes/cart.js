const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/cart/:userId - get cart for user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/cart/:userId/add - add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [] });
    }
    const existing = cart.items.find(item => item.productId.toString() === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Invalid cart data' });
  }
});

// POST /api/cart/:userId/remove - remove item from cart
router.post('/:userId/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Invalid cart data' });
  }
});

// POST /api/cart/:userId/clear - clear cart
router.post('/:userId/clear', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: 'Invalid cart data' });
  }
});

module.exports = router;
