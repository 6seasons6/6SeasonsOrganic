// Orders API route
const ordersRoute = require("./routes/orders");

// ...existing code...

// ...existing code...

// Payment API route
const paymentRoute = require("./routes/payment");

// backend/index.js
// Entry point for 6seasonsorganic backend API

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/payment", paymentRoute);
app.use("/api/orders", ordersRoute);
// MongoDB Atlas connection
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://fairfederations2609_db_user:Ananya2626.@cluster0.md5bemy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("6seasonsorganic backend API running");
});

// Products API route
const productsRoute = require("./routes/products");
app.use("/api/products", productsRoute);

// Reviews API route
const reviewsRoute = require("./routes/reviews");
app.use("/api/reviews", reviewsRoute);

// Cart API route
const cartRoute = require("./routes/cart");
app.use("/api/cart", cartRoute);

const addressRoute = require("./routes/address");
app.use("/api/address", addressRoute);

// Wishlist API route
const wishlistRoute = require("./routes/wishlist");
app.use("/api/wishlist", wishlistRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
