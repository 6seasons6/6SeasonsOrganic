const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
console.log("Orders route loaded");

router.post("/", async (req, res) => {
  console.log("Received POST /api/orders");
  try {
    console.log("Order payload:", req.body);
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Email logic using nodemailer

const nodemailer = require("nodemailer");
const OWNER_EMAIL = process.env.OWNER_EMAIL || "6seasonsorganic@gmail.com";
const EMAIL_USER = process.env.EMAIL_USER || OWNER_EMAIL;
const EMAIL_PASS = process.env.EMAIL_PASS || "";

// Log email config for debugging (do not log password in production)
console.log("Email config:", { OWNER_EMAIL, EMAIL_USER, EMAIL_PASS_SET: !!EMAIL_PASS });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

async function sendOrderEmails(order) {
  const customerEmail = order.user?.email;
  const orderDetails = `Order placed by: ${order.address.name} (${order.user?.email || "Guest"})\n\nItems:\n${order.cart.map(i => `${i.name} x ${i.qty} - ₹${(i.discountedPrice || i.price) * i.qty}`).join("\n")}\n\nTotal: ₹${order.total}\nShipping: ${order.shippingMethod}\nAddress: ${order.address.addressLine1}, ${order.address.city}, ${order.address.state}, ${order.address.zip}, ${order.address.country}`;
  // Email to owner
  try {
    await transporter.sendMail({
      from: OWNER_EMAIL,
      to: OWNER_EMAIL,
      subject: `New Order Received - ${order.address.name}`,
      text: orderDetails
    });
    console.log("[MAIL] Order email sent to owner (", OWNER_EMAIL, ") for order by ", order.address.name);
  } catch (err) {
    console.error("[MAIL] Failed to send email to owner (", OWNER_EMAIL, "):", err);
  }
  // Email to customer
  if (customerEmail) {
    try {
      await transporter.sendMail({
        from: OWNER_EMAIL,
        to: customerEmail,
        subject: "Your 6SeasonsOrganic Order Confirmation",
        text: `Thank you for your order!\n\n${orderDetails}`
      });
      console.log("[MAIL] Order confirmation email sent to customer (", customerEmail, ")");
    } catch (err) {
      console.error("[MAIL] Failed to send email to customer (", customerEmail, "):", err);
    }
  } else {
    console.log("[MAIL] No customer email found, skipping customer confirmation email.");
  }
}

// Update order POST to send emails
router.post("/", async (req, res) => {
  console.log("Received POST /api/orders");
  try {
    console.log("Order payload:", req.body);
    const order = new Order(req.body);
    await order.save();
    // Send emails
    try {
      await sendOrderEmails(order);
    } catch (emailErr) {
      console.error("Order email error:", emailErr);
    }
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// (Optional) Get all orders for a user
router.get("/:uid", async (req, res) => {
  try {
    const orders = await Order.find({ "user.uid": req.params.uid }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
