import React from "react";
import "./ProductCard.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, loading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    addToWishlist(product);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="product-card-link"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product-card">
        {product.discountedPrice && product.discountedPrice < product.price && (
          <div className="product-discount-badge">
            -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-img"
        />
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-bottom">
          {product.discountedPrice && product.discountedPrice < product.price ? (
            <>
              <span className="product-price-strike">
                ₹{product.price}
              </span>
              <span className="product-discounted">
                ₹{product.discountedPrice}
              </span>
              <span className="product-discount-percent">
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="product-price">₹{product.price}</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "center" }}>
          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button
            className="wishlist-heart-btn"
            onClick={handleAddToWishlist}
            disabled={wishlistLoading || wishlist?.some((i) => i._id === product._id)}
            aria-label={wishlist?.some((i) => i._id === product._id) ? "Wishlisted" : "Add to Wishlist"}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginLeft: 4,
              cursor: wishlist?.some((i) => i._id === product._id) ? 'not-allowed' : 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {wishlist?.some((i) => i._id === product._id) ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z"/></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z"/></svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
