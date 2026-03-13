const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  weight: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  tags: [{ type: String }],
  brand: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
