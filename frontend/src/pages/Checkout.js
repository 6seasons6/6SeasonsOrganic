import React, { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

const Checkout = () => {
  // Handle place order button click
  const handlePlaceOrder = async () => {
    // Gather all order details
    const orderData = {
      user: user ? { uid: user.uid, email: user.email } : null,
      address: form,
      shippingMethod,
      paymentMethod: paymentSuccess ? 'razorpay' : 'cod',
      paymentStatus: paymentSuccess ? 'paid' : 'pending',
      cart,
      total: cartTotal + (shippingMethod === 'express' ? 99 : 0),
      placedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        // Send email to owner and customer (handled by backend)
        clearCart();
        alert('Order placed successfully!');
        window.location.href = '/'; // Redirect to homepage
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (err) {
      alert('Error placing order. Please try again.');
    }
  };
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  // Stepper state
  const [step, setStep] = useState(0); // 0: Address, 1: Shipping, 2: Payment, 3: Review
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const handleSelect = (id) => {
    setSelectedAddress(id);
    const addr = addresses.find((a) => a._id === id);
    if (addr) setForm(addr);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/address/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setAddresses(data));
    }
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`http://localhost:5000/api/address/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    // Optionally, refresh addresses after saving
    fetch(`http://localhost:5000/api/address/${user.uid}`)
      .then((res) => res.json())
      .then((data) => setAddresses(data));
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "2.5rem auto 4rem auto",
        padding: "0 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Main Stepper Section */}
        <div style={{ flex: 2, minWidth: 420 }}>
          {/* Stepper Navigation */}
          <div style={{ display: "flex", gap: 18, marginBottom: 32 }}>
            {["Address", "Shipping", "Payment", "Review"].map((label, idx) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: step === idx ? "#6cb33f" : "#bdbdbd",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {idx + 1}
                </div>
                <span
                  style={{
                    fontWeight: step === idx ? 800 : 600,
                    fontSize: 18,
                    color: step === idx ? "#222" : "#888",
                  }}
                >
                  {label}
                </span>
                {idx < 3 && (
                  <div
                    style={{
                      width: 32,
                      height: 2,
                      background: "#e0e0e0",
                      margin: "0 8px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 0 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
                marginBottom: 32,
                padding: "2rem 2.5rem",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#222",
                  marginBottom: 18,
                }}
              >
                Shipping address
              </div>
              {addresses.length > 0 && (
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 18 }}>
                  {addresses.map((addr) => (
                    <li
                      key={addr._id}
                      style={{
                        marginBottom: 10,
                        background:
                          selectedAddress === addr._id ? "#eaffd0" : "#f7faf5",
                        borderRadius: 8,
                        padding: 12,
                        border:
                          selectedAddress === addr._id
                            ? "2px solid #6cb33f"
                            : "1px solid #e0e0e0",
                        transition: "all 0.2s",
                      }}
                    >
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr._id}
                          onChange={() => handleSelect(addr._id)}
                        />
                        <span style={{ fontWeight: 600, color: "#333" }}>
                          {addr.name}, {addr.addressLine1}, {addr.city},{" "}
                          {addr.state}, {addr.zip}, {addr.country}{" "}
                          <span style={{ color: "#6cb33f", fontWeight: 700 }}>
                            ({addr.phone})
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <form
                onSubmit={handleSaveAddress}
                style={{
                  marginBottom: 0,
                  background: "#f7faf5",
                  padding: 18,
                  borderRadius: 12,
                  boxShadow: "0 1px 4px rgba(108,179,63,0.05)",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 10,
                    color: "#6cb33f",
                  }}
                >
                  Add New Address
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                    style={{
                      flex: 1,
                      minWidth: 120,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                    style={{
                      flex: 1,
                      minWidth: 120,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    placeholder="Address Line 1"
                    required
                    style={{
                      flex: 2,
                      minWidth: 180,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                    placeholder="Address Line 2"
                    style={{
                      flex: 2,
                      minWidth: 180,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    style={{
                      flex: 1,
                      minWidth: 100,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    style={{
                      flex: 1,
                      minWidth: 100,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    placeholder="ZIP"
                    required
                    style={{
                      flex: 1,
                      minWidth: 80,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    required
                    style={{
                      flex: 1,
                      minWidth: 100,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #e0e0e0",
                      fontSize: 15,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    marginTop: 16,
                    background: "#6cb33f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 28px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    float: "right",
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
                <div style={{ clear: "both" }} />
              </form>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setStep(1)}
                  disabled={!selectedAddress && !form.addressLine1}
                  style={{
                    background: "#6cb33f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
                marginBottom: 32,
                padding: "2rem 2.5rem",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#222",
                  marginBottom: 18,
                }}
              >
                Shipping Method
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <label
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                  />
                  <span style={{ fontWeight: 600 }}>
                    Standard (3-5 days) - Free
                  </span>
                </label>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                  />
                  <span style={{ fontWeight: 600 }}>
                    Express (1-2 days) - ₹99
                  </span>
                </label>
              </div>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => setStep(0)}
                  style={{
                    background: "#eee",
                    color: "#333",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    background: "#6cb33f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
                marginBottom: 32,
                padding: "2rem 2.5rem",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#222",
                  marginBottom: 18,
                }}
              >
                Payment
              </div>
              <button
                style={{
                  background: "#6cb33f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "14px 36px",
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: "pointer",
                  marginBottom: 18,
                }}
                onClick={async () => {
                  // Razorpay integration (call backend, not Razorpay API directly)
                  // 1. Ensure Razorpay script is loaded
                  function loadRazorpayScript() {
                    return new Promise((resolve) => {
                      if (window.Razorpay) return resolve(true);
                      const script = document.createElement("script");
                      script.src =
                        "https://checkout.razorpay.com/v1/checkout.js";
                      script.onload = () => resolve(true);
                      script.onerror = () => resolve(false);
                      document.body.appendChild(script);
                    });
                  }

                  const scriptLoaded = await loadRazorpayScript();
                  if (!scriptLoaded) {
                    alert("Failed to load Razorpay SDK. Please try again.");
                    return;
                  }

                  const res = await fetch(
                    "http://localhost:5000/api/payment/create-order",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        amount:
                          (cartTotal +
                            (shippingMethod === "express" ? 99 : 0)) *
                          100,
                        currency: "INR",
                        receipt: "order_rcptid_11",
                      }),
                    }
                  );
                  const data = await res.json();
                  if (!data.id) {
                    alert("Failed to create payment order. Please try again.");
                    return;
                  }
                  const options = {
                    key: "rzp_test_8Ic05YIxwCqwyr",
                    amount: data.amount,
                    currency: data.currency,
                    name: "6Seasons Organic",
                    description: "Order Payment",
                    order_id: data.id,
                    handler: function (response) {
                      setPaymentSuccess(true);
                      setStep(3);
                    },
                    prefill: {
                      name: form.name,
                      email: user?.email,
                      contact: form.phone,
                    },
                    theme: { color: "#6cb33f" },
                  };
                  const rzp = new window.Razorpay(options);
                  rzp.open();
                }}
                disabled={paymentSuccess}
              >
                Pay with Razorpay
              </button>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: "#eee",
                    color: "#333",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!paymentSuccess}
                  style={{
                    background: paymentSuccess ? "#6cb33f" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: paymentSuccess ? "pointer" : "not-allowed",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
                marginBottom: 32,
                padding: "2rem 2.5rem",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: "#222",
                  marginBottom: 18,
                }}
              >
                Review & Place Order
              </div>
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{ fontWeight: 700, color: "#6cb33f", marginBottom: 6 }}
                >
                  Shipping Address:
                </div>
                <div>
                  {form.name}, {form.addressLine1}, {form.city}, {form.state},{" "}
                  {form.zip}, {form.country} ({form.phone})
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{ fontWeight: 700, color: "#6cb33f", marginBottom: 6 }}
                >
                  Shipping Method:
                </div>
                <div>
                  {shippingMethod === "express"
                    ? "Express (1-2 days) - ₹99"
                    : "Standard (3-5 days) - Free"}
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{ fontWeight: 700, color: "#6cb33f", marginBottom: 6 }}
                >
                  Order Items:
                </div>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cart.map((item) => (
                    <li key={item._id} style={{ marginBottom: 8 }}>
                      {item.name} x {item.qty} - ₹
                      {(item.discountedPrice || item.price) * item.qty}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  marginBottom: 18,
                  textAlign: "right",
                  color: "#222",
                }}
              >
                Total: ₹{cartTotal + (shippingMethod === "express" ? 99 : 0)}
              </div>
              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => setStep(2)}
                  style={{
                    background: "#eee",
                    color: "#333",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  style={{
                    background: "#6cb33f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 32px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <section
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
            padding: "2rem 2rem 1.5rem 2rem",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              color: "#6cb33f",
              fontSize: 26,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            Summary
          </div>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: 18 }}>
            {cart.map((item) => (
              <li
                key={item._id}
                style={{
                  marginBottom: 12,
                  fontSize: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: "#888" }}>x {item.qty}</span>
                <span style={{ fontWeight: 700, color: "#6cb33f" }}>
                  ₹{(item.discountedPrice || item.price) * item.qty}
                </span>
              </li>
            ))}
          </ul>
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
              textAlign: "right",
              color: "#222",
            }}
          >
            Subtotal: ₹{cartTotal}
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 8,
              textAlign: "right",
              color: "#888",
            }}
          >
            Shipping: FREE
          </div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 18,
              textAlign: "right",
              color: "#888",
            }}
          >
            Estimated tax: --
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 18,
              textAlign: "right",
              color: "#222",
            }}
          >
            Total: ₹{cartTotal}
          </div>
          <button
            onClick={handlePlaceOrder}
            style={{
              background: "#6cb33f",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 36px",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              width: "100%",
            }}
            disabled={!selectedAddress && !form.addressLine1}
          >
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};
export default Checkout;
