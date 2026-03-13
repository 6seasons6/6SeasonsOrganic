import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, cartTotal, removeFromCart, clearCart, addToCart } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) return;
    // Remove if qty set to 0
    if (newQty === 0) removeFromCart(item._id);
    else {
      // Add or update: call addToCart as many times as needed
      const diff = newQty - item.qty;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) addToCart(item, 1);
      } else if (diff < 0) {
        for (let i = 0; i < -diff; i++) removeFromCart(item._id);
        // This will remove all, so re-add if needed
        if (newQty > 0) for (let i = 0; i < newQty; i++) addToCart(item, 1);
      }
    }
  };

  const handleCheckout = () => {
    // Placeholder: navigate to /checkout or show alert
    navigate('/checkout');
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(108,179,63,0.07)" }}>
      <h2 style={{ color: "#6cb33f", fontWeight: 800, marginBottom: 24 }}>Your Cart</h2>
      {cart.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18 }}>Your cart is empty.</div>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cart.map((item) => (
              <li key={item._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/products/${item._id}`)}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#6cb33f', textDecoration: 'underline' }}>{item.name}</div>
                  <div style={{ color: "#888", fontSize: 15 }}>Price: ₹{item.discountedPrice || item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => handleQtyChange(item, item.qty - 1)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>-</button>
                  <input type="number" min={1} value={item.qty} onChange={e => handleQtyChange(item, Number(e.target.value))} style={{ width: 40, textAlign: 'center', fontSize: 16, border: '1px solid #ccc', borderRadius: 4 }} />
                  <button onClick={() => handleQtyChange(item, item.qty + 1)} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '2px 8px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginRight: 16 }}>₹{(item.discountedPrice || item.price) * item.qty}</div>
                <button onClick={() => removeFromCart(item._id)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontWeight: 600, cursor: "pointer" }}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, fontSize: 20, marginTop: 24, textAlign: "right" }}>Total: ₹{cartTotal}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 18 }}>
            <button onClick={clearCart} style={{ background: "#ffe066", color: "#222", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Clear Cart</button>
            <button onClick={handleCheckout} style={{ background: "#6cb33f", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
