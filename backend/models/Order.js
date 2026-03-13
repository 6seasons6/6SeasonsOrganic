const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      uid: String,
      email: String,
    },
    address: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    shippingMethod: String,
    paymentMethod: String,
    paymentStatus: String,
    cart: [
      {
        _id: String,
        name: String,
        qty: Number,
        price: Number,
        discountedPrice: Number,
      },
    ],
    total: Number,
    placedAt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
