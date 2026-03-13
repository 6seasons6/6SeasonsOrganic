
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// GET /api/products/featured - get featured products
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/bestsellers - get best seller products
router.get("/bestsellers", async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/products - get all products (with optional category, sort, price range)
router.get("/", async (req, res) => {
  try {
    const { category, sort, minPrice, maxPrice } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let query = Product.find(filter);
    if (sort === "price-asc") query = query.sort({ discountedPrice: 1, price: 1 });
    if (sort === "price-desc") query = query.sort({ discountedPrice: -1, price: -1 });
    if (sort === "popularity") query = query.sort({ rating: -1 });
    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/categories/list - get all unique categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/:id - get product by id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
