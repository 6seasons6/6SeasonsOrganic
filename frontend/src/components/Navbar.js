import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const Navbar = () => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [categories, setCategories] = useState(["All"]);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { cart, cartCount, cartTotal } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    fetch("http://localhost:5000/api/products/categories/list")
      .then((res) => res.json())
      .then((data) => setCategories(["All", ...data]))
      .catch(() => setCategories(["All"]));
  }, []);

  const handleCategorySelect = (cat) => {
    setShowShopDropdown(false);
    if (cat === "All") {
      navigate("/products");
    } else {
      navigate(`/products?category=${encodeURIComponent(cat)}`);
    }
  };

  const [showCart, setShowCart] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img
          src={require("../assets/logo.png")}
          alt="6seasonsorganic Logo"
          height={40}
        />
        <span> 6 Seasons Organic</span>
      </div>
      {/* Remove hamburger menu if present */}
      <ul>
        <li>
          <Link to="/">Home</Link>
          <li>
            <Link to="/sample-lead" className="nav-link">
              Try a Free Sample
            </Link>
          </li>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li
          className="shop-dropdown"
          style={{ position: "relative" }}
          onMouseEnter={() => {
            setShowShopDropdown(true);
            setShowUserDropdown(false);
            setShowCart(false);
          }}
          onMouseLeave={() => setShowShopDropdown(false)}
        >
          <span className="shop-link">Shop</span>
          {showShopDropdown && (
            <ul
              className="dropdown-menu"
              style={{
                position: "absolute",
                left: 0,
                top: 36,
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(108,179,63,0.13)",
                minWidth: 180,
                zIndex: 100,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: 8,
                    cursor: "pointer",
                    color: "#333",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
        <li style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              marginRight: 8,
            }}
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
          >
            <span role="img" aria-label="wishlist">
              ❤️
            </span>
            {wishlist && wishlist.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -10,
                  background: "#e74c3c",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {wishlist.length}
              </span>
            )}
          </button>
        </li>
        <li style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              setShowCart((v) => !v);
              setShowShopDropdown(false);
              setShowUserDropdown(false);
            }}
            aria-label="Cart"
          >
            <span role="img" aria-label="cart">
              🛒
            </span>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -10,
                  background: "#6cb33f",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 7px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
          {showCart && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 36,
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(108,179,63,0.13)",
                minWidth: 280,
                zIndex: 100,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Cart</div>
              {cart.length === 0 ? (
                <div style={{ color: "#888", fontSize: 15 }}>
                  Your cart is empty.
                </div>
              ) : (
                <>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {cart.map((item) => (
                      <li
                        key={item._id}
                        style={{ marginBottom: 8, fontSize: 15 }}
                      >
                        {item.name} x {item.qty}{" "}
                        <span style={{ float: "right" }}>
                          ₹{(item.discountedPrice || item.price) * item.qty}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ fontWeight: 600, marginTop: 10, fontSize: 16 }}>
                    Total: ₹{cartTotal}
                  </div>
                  <Link
                    to="/cart"
                    style={{
                      color: "#6cb33f",
                      fontWeight: 700,
                      display: "block",
                      marginTop: 10,
                    }}
                    onClick={() => setShowCart(false)}
                  >
                    Go to Cart
                  </Link>
                </>
              )}
            </div>
          )}
        </li>
        <li style={{ position: "relative" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              color: "#333",
              padding: 0,
            }}
            onClick={() => {
              setShowUserDropdown((v) => !v);
              setShowShopDropdown(false);
              setShowCart(false);
            }}
            aria-label="User menu"
          >
            <span role="img" aria-label="user">
              👤
            </span>
          </button>
          {showUserDropdown && (
            <ul
              style={{
                position: "absolute",
                right: 0,
                top: 36,
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(108,179,63,0.13)",
                minWidth: 180,
                zIndex: 100,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              {!user && (
                <>
                  <li>
                    <Link
                      to="/signin"
                      onClick={() => setShowUserDropdown(false)}
                      style={{
                        color: "#333",
                        textDecoration: "none",
                        display: "block",
                        padding: 8,
                      }}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={() => setShowUserDropdown(false)}
                      style={{
                        color: "#333",
                        textDecoration: "none",
                        display: "block",
                        padding: 8,
                      }}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/orders"
                  onClick={() => setShowUserDropdown(false)}
                  style={{
                    color: "#333",
                    textDecoration: "none",
                    display: "block",
                    padding: 8,
                  }}
                >
                  Order History
                </Link>
              </li>
              {user && (
                <li>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6cb33f",
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                      padding: 8,
                    }}
                    onClick={() => {
                      setShowUserDropdown(false);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                </li>
              )}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
