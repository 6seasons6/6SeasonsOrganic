const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      discountedPrice: Number,
      image: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", WishlistSchema);
