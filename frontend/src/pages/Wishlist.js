import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    addToCart(item, 1);
    removeFromWishlist(item._id);
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 20 }}>
      <h2 style={{ color: "#6cb33f", fontWeight: 800 }}>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18, marginTop: 30 }}>Your wishlist is empty.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {wishlist.map((item) => (
            <li key={item._id} style={{ display: "flex", alignItems: "center", marginBottom: 18, background: "#f7faf5", borderRadius: 10, padding: 16 }}>
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginRight: 18 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{item.name}</div>
                <div style={{ color: "#6cb33f", fontWeight: 600, fontSize: 16 }}>₹{item.discountedPrice || item.price}</div>
              </div>
              <button onClick={() => handleMoveToCart(item)} style={{ background: "#6cb33f", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, fontSize: 15, marginRight: 10, cursor: "pointer" }}>Move to Cart</button>
              <button onClick={() => removeFromWishlist(item._id)} style={{ background: "#eee", color: "#333", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
