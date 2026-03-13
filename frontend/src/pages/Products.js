import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Products.css";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const sortOptions = [
  { value: "", label: "Default" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const query = useQuery();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const location = useLocation();
  const { wishlist, addToWishlist, loading: wishlistLoading } = useWishlist();

  const category = query.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let url = "http://localhost:5000/api/products?";
        if (category && category !== "All")
          url += `category=${encodeURIComponent(category)}&`;
        if (sort) url += `sort=${sort}&`;
        if (minPrice) url += `minPrice=${minPrice}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, minPrice, maxPrice]);

  const handleSortChange = (e) => setSort(e.target.value);
  const handlePriceFilter = (e) => {
    e.preventDefault();
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };
  const handleClearFilters = () => {
    setSort("");
    setMinPrice("");
    setMaxPrice("");
    navigate("/products");
  };

  // Add to cart logic
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!user) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    addToCart(product);
  };

  // Add to wishlist logic
  const handleAddToWishlist = (e, product) => {
    e.preventDefault();
    if (!user) {
      navigate("/signin", { state: { from: location } });
      return;
    }
    addToWishlist(product);
  };

  return (
    <div
      style={{
        maxWidth: 1300,
        margin: "2.5rem auto 4rem auto",
        padding: "0 1rem",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          color: "#6cb33f",
          fontSize: "2.2rem",
          marginBottom: 32,
          fontWeight: 800,
          textAlign: "left",
          letterSpacing: 1,
        }}
      >
        Our Products {category && category !== "All" ? `- ${category}` : ""}
      </div>
      <div style={{ display: "flex", gap: 40 }}>
        <aside
          style={{
            minWidth: 260,
            maxWidth: 320,
            background: "#f7faf5",
            borderRadius: 18,
            boxShadow: "0 2px 8px rgba(108,179,63,0.07)",
            padding: "2rem 1.5rem",
            height: "fit-content",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          <form
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
            onSubmit={handlePriceFilter}
          >
            <label
              style={{
                fontSize: 16,
                color: "#222",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 500,
              }}
            >
              Sort by:
              <select
                value={sort}
                onChange={handleSortChange}
                style={{
                  padding: "0.4rem 0.7rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                  fontSize: 15,
                  background: "#fff",
                  marginLeft: 8,
                }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label
              style={{
                fontSize: 16,
                color: "#222",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 500,
              }}
            >
              Min Price:
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                style={{
                  padding: "0.4rem 0.7rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                  fontSize: 15,
                  background: "#fff",
                  marginLeft: 8,
                }}
              />
            </label>
            <label
              style={{
                fontSize: 16,
                color: "#222",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontWeight: 500,
              }}
            >
              Max Price:
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                style={{
                  padding: "0.4rem 0.7rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                  fontSize: 15,
                  background: "#fff",
                  marginLeft: 8,
                }}
              />
            </label>
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #6cb33f, #ffe066)",
                color: "#222",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 0",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 10,
                marginBottom: 0,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: "linear-gradient(90deg, #ffe066, #6cb33f)",
                color: "#222",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 0",
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 0,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Clear
            </button>
          </form>
        </aside>
        <main style={{ flex: 1 }}>
          {loading && (
            <div
              style={{
                textAlign: "center",
                color: "#d32f2f",
                marginBottom: 24,
              }}
            >
              Loading...
            </div>
          )}
          {error && (
            <div
              style={{
                textAlign: "center",
                color: "#d32f2f",
                marginBottom: 24,
              }}
            >
              {error}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              justifyContent: "flex-start",
            }}
          >
            {products.map((product) => (
              <Link
                to={`/products/${product._id}`}
                className="product-card-link"
                key={product._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 18,
                    boxShadow: "0 2px 12px rgba(108,179,63,0.07)",
                    padding: "1.5rem 1.2rem 1.2rem 1.2rem",
                    width: 260,
                    minWidth: 220,
                    textAlign: "center",
                    transition: "box-shadow 0.2s, border 0.2s, transform 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  {product.discountedPrice &&
                    product.discountedPrice < product.price && (
                      <div
                        className="product-discount-badge"
                        style={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          background:
                            "linear-gradient(90deg,#e53935,#ffe066 90%)",
                          color: "#fff",
                          fontSize: "1rem",
                          fontWeight: 800,
                          padding: "6px 16px",
                          borderRadius: "1.2rem 1.2rem 1.2rem 0",
                          boxShadow: "0 2px 8px rgba(229,57,53,0.10)",
                          zIndex: 2,
                          letterSpacing: 1,
                          animation:
                            "badgePop 0.7s cubic-bezier(.23,1.01,.32,1) both",
                        }}
                      >
                        -
                        {Math.round(
                          ((product.price - product.discountedPrice) /
                            product.price) *
                            100,
                        )}
                        %
                      </div>
                    )}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "contain",
                      borderRadius: 16,
                      marginBottom: 16,
                      background: "#f7faf5",
                      border: "2px solid #6cb33f",
                      boxShadow: "0 1px 4px rgba(108,179,63,0.05)",
                    }}
                  />
                  <h3
                    style={{
                      color: "#6cb33f",
                      marginBottom: 8,
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      color: "#555",
                      fontSize: 15,
                      marginBottom: 18,
                      minHeight: 48,
                    }}
                  >
                    {product.description}
                  </p>
                  <div
                    style={{
                      padding: "0.6rem 1.5rem",
                      fontSize: 17,
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(108,179,63,0.10)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      marginTop: "auto",
                      gap: 12,
                    }}
                  >
                    {product.discountedPrice &&
                    product.discountedPrice < product.price ? (
                      <>
                        <span
                          style={{
                            color: "#b0b0b0",
                            textDecoration: "line-through",
                            fontSize: 15,
                            marginRight: 8,
                            fontWeight: 500,
                          }}
                        >
                          ₹{product.price}
                        </span>
                        <span
                          style={{
                            color: "#6cb33f",
                            fontSize: 18,
                            fontWeight: 700,
                            marginRight: 8,
                          }}
                        >
                          ₹{product.discountedPrice}
                        </span>
                        <span
                          style={{
                            color: "#e53935",
                            fontSize: 15,
                            fontWeight: 600,
                            background: "#ffeaea",
                            borderRadius: 6,
                            padding: "2px 8px",
                          }}
                        >
                          -
                          {Math.round(
                            ((product.price - product.discountedPrice) /
                              product.price) *
                              100,
                          )}
                          %
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: "#ffe066",
                          fontSize: 17,
                          fontWeight: 700,
                        }}
                      >
                        ₹{product.price}
                      </span>
                    )}
                    <button
                      style={{
                        background: "linear-gradient(90deg, #6cb33f, #ffe066)",
                        color: "#222",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.5rem 1.2rem",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: "pointer",
                        marginLeft: 8,
                        transition: "background 0.2s, color 0.2s",
                      }}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="wishlist-heart-btn"
                      onClick={(e) => handleAddToWishlist(e, product)}
                      disabled={
                        wishlistLoading ||
                        wishlist?.some((i) => i._id === product._id)
                      }
                      aria-label={
                        wishlist?.some((i) => i._id === product._id)
                          ? "Wishlisted"
                          : "Add to Wishlist"
                      }
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        marginLeft: 8,
                        cursor: wishlist?.some((i) => i._id === product._id)
                          ? "not-allowed"
                          : "pointer",
                        outline: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {wishlist?.some((i) => i._id === product._id) ? (
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="#e53935"
                          stroke="#e53935"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
                        </svg>
                      ) : (
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#e53935"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
