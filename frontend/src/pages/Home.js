// Fun facts for ticker
import React, { useEffect, useState } from "react";
import "./Home.css";
import ProductCard from "../components/ProductCard";
import BlogSection from "../components/BlogSection";
import Modal from "react-modal";
import { FaLeaf, FaSeedling, FaCube, FaHotjar } from "react-icons/fa";
import HomePopper from "../components/HomePopper";
const organicFacts = [
  "Organic farming helps preserve biodiversity and soil health.",
  "No synthetic pesticides or fertilizers are used in organic products.",
  "Organic food is often fresher because it doesn’t contain preservatives.",
  "Supporting organic means supporting local farmers and the environment.",
  "Organic farming uses less energy and produces less waste.",
  "Eating organic reduces your exposure to harmful chemicals.",
];

function OrganicFactTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % organicFacts.length),
      4200
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="organic-fact-ticker">
      <span className="fact-leaf">🍃</span>
      <span className="fact-text">{organicFacts[idx]}</span>
    </div>
  );
}

// Organic quote carousel
const organicQuotes = [
  {
    quote: "“The greatest wealth is health.”",
    author: "Virgil",
  },
  {
    quote: "“Let food be thy medicine and medicine be thy food.”",
    author: "Hippocrates",
  },
  {
    quote: "“Nature itself is the best physician.”",
    author: "Hippocrates",
  },
  {
    quote:
      "“To forget how to dig the earth and to tend the soil is to forget ourselves.”",
    author: "Mahatma Gandhi",
  },
  {
    quote: "“Eat food. Not too much. Mostly plants.”",
    author: "Michael Pollan",
  },
];

function OrganicQuoteCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % organicQuotes.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="organic-quote-carousel">
      <div className="organic-quote-text">{organicQuotes[idx].quote}</div>
      <div className="organic-quote-author">— {organicQuotes[idx].author}</div>
    </div>
  );
}

const Home = () => {
  const navigate = require('react-router-dom').useNavigate();
  // Free sample modal state
  const [sampleOpen, setSampleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("honey");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const honeyProducts = [
    {
      id: "honey1",
      name: "Raw Organic Honey",
      desc: "Pure, unprocessed honey from organic farms.",
      img: "https://cdn-icons-png.flaticon.com/512/2909/2909763.png",
    },
  ];
  const otherProducts = [
    {
      id: "pulses",
      name: "Organic Pulses",
      desc: "High-quality, chemical-free pulses.",
      img: "https://cdn-icons-png.flaticon.com/512/2909/2909802.png",
    },
    {
      id: "spices",
      name: "Organic Spices",
      desc: "Aromatic, pure organic spices.",
      img: "https://cdn-icons-png.flaticon.com/512/2909/2909787.png",
    },
  ];

  const handleAddProduct = (prod) => {
    if (!selectedProducts.find((p) => p.id === prod.id)) {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };
  const handleRemoveProduct = (prod) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== prod.id));
  };
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:5000/api/products/featured").then((res) =>
        res.json()
      ),
      fetch("http://localhost:5000/api/products/bestsellers").then((res) =>
        res.json()
      ),
    ]).then(([featuredData, bestData]) => {
      setFeatured(featuredData);
      setBestsellers(bestData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="home-container">
      {/* Free Sample Popup Trigger */}
      <button className="sample-lead-btn" style={{position:'fixed',bottom:'32px',right:'32px',zIndex:9999}} onClick={()=>setSampleOpen(true)}>Try a Free Sample</button>

      <Modal
        isOpen={sampleOpen}
        onRequestClose={() => setSampleOpen(false)}
        className="sample-modal"
        overlayClassName="sample-modal-overlay"
        ariaHideApp={false}
      >
        <div className="sample-modal-content">
          <h2>Unlock Your Gift!</h2>
          <div className="sample-modal-tabs">
            <button
              className={activeTab === "honey" ? "active" : ""}
              onClick={() => setActiveTab("honey")}
            >
              Raw Organic Honey
            </button>
            <button
              className={activeTab === "other" ? "active" : ""}
              onClick={() => setActiveTab("other")}
            >
              Other Organic Products
            </button>
          </div>
          <div className="sample-modal-products">
            {(activeTab === "honey" ? honeyProducts : otherProducts).map(
              (prod) => (
                <div className="sample-product-card" key={prod.id}>
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="sample-product-img"
                  />
                  <div className="sample-product-info">
                    <div className="sample-product-name">{prod.name}</div>
                    <div className="sample-product-desc">{prod.desc}</div>
                  </div>
                  {selectedProducts.find((p) => p.id === prod.id) ? (
                    <button
                      className="sample-product-remove"
                      onClick={() => handleRemoveProduct(prod)}
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      className="sample-product-add"
                      onClick={() => handleAddProduct(prod)}
                    >
                      Add
                    </button>
                  )}
                </div>
              )
            )}
          </div>
          <div className="sample-modal-summary">
            <span>{selectedProducts.length} Item | Free</span>
            <button
              className="sample-modal-continue"
              disabled={selectedProducts.length === 0}
              onClick={() => { setSampleOpen(false); navigate('/sample-lead'); }}
            >
              Continue
            </button>
          </div>
          <button
            className="sample-close-btn"
            onClick={() => setSampleOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
      <HomePopper />
      <div className="home-bg-shape1"></div>
      <div className="home-bg-shape2"></div>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to 6 Seasons Organic</h1>
          <p>Pure. Fresh. Organic. Delivered to your doorstep.</p>
          <a href="/products" className="hero-btn">
            Shop Now
          </a>
        </div>
        <div className="hero-image">
          <img src={require("../assets/logo.png")} alt="6seasonsorganic Logo" />
        </div>
        {/* Butterfly and leaves icons only inside banner */}
        <div className="banner-icons">
          <div className="floating-leaf leaf1">🍃</div>
          <div className="floating-leaf leaf2">🍂</div>
          <div className="floating-leaf leaf3">🌿</div>
          <svg
            className="organic-butterfly"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="20"
              cy="30"
              rx="18"
              ry="10"
              fill="#ffe066"
              fillOpacity="0.7"
            />
            <ellipse
              cx="40"
              cy="30"
              rx="18"
              ry="10"
              fill="#b6e388"
              fillOpacity="0.7"
            />
            <ellipse cx="30" cy="30" rx="6" ry="12" fill="#6cb33f" />
            <rect x="28" y="18" width="4" height="24" rx="2" fill="#444" />
            <circle cx="30" cy="18" r="3" fill="#444" />
          </svg>
        </div>
      </section>

      {/* Organic living badges */}
      <div className="organic-badges">
        <div className="organic-badge">
          <span className="badge-icon">🌱</span>
          <span className="badge-text">Eco-Friendly</span>
        </div>
        <div className="organic-badge">
          <span className="badge-icon">🥦</span>
          <span className="badge-text">100% Vegan</span>
        </div>
        <div className="organic-badge">
          <span className="badge-icon">🐝</span>
          <span className="badge-text">Cruelty-Free</span>
        </div>
        <div className="organic-badge">
          <span className="badge-icon">🏡</span>
          <span className="badge-text">Locally Sourced</span>
        </div>
        <div className="organic-badge">
          <span className="badge-icon">♻️</span>
          <span className="badge-text">Sustainable</span>
        </div>
      </div>

      {/* Organic quote carousel */}
      <OrganicQuoteCarousel />

      {/* Certification section */}
      <section className="certification-section">
        <h3 className="certification-title">
          Our Certifications & Recognitions
        </h3>
        <div className="certification-logos single-row">
          <div className="cert-logo-block">
            <img
              src={require("../assets/fssai.png")}
              alt="FSSAI License"
              className="cert-logo"
            />
            <span className="cert-label">FSSAI Licensed</span>
          </div>
          <div className="cert-logo-block">
            <img
              src={require("../assets/apeda.png")}
              alt="APEDA"
              className="cert-logo"
            />
            <span className="cert-label">APEDA Certified</span>
          </div>
          <div className="cert-logo-block">
            <img
              src={require("../assets/startupindia.png")}
              alt="Startup India"
              className="cert-logo"
            />
            <span className="cert-label">Startup India Recognized</span>
            <div className="cert-number-inline">
              <span>
                Certificate No: <b>DIPP158831</b>
              </span>
            </div>
          </div>
          <div className="cert-logo-block">
            <img
              src={require("../assets/IEC.png")}
              alt="Export License IEC"
              className="cert-logo"
            />
            <span className="cert-label">Export License (IEC)</span>
          </div>
        </div>
      </section>

      {/* Organic fun fact ticker */}
      <OrganicFactTicker />

      {/* Decorative plant leaves on left and right */}
      <svg
        className="plant-leaf plant-leaf-left"
        viewBox="0 0 120 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 320C-10 200 10 60 120 0C80 80 100 200 60 320Z"
          fill="#b6e388"
        />
        <path
          d="M60 320C10 220 40 100 110 20C90 100 80 200 60 320Z"
          fill="#6cb33f"
        />
      </svg>
      <svg
        className="plant-leaf plant-leaf-right"
        viewBox="0 0 120 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 320C130 200 110 60 0 0C40 80 20 200 60 320Z"
          fill="#b6e388"
        />
        <path
          d="M60 320C110 220 80 100 10 20C30 100 40 200 60 320Z"
          fill="#6cb33f"
        />
      </svg>

      <svg
        className="section-separator"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 C480,80 960,-20 1440,60 L1440,60 L0,60 Z" fill="#fff" />
      </svg>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span role="img" aria-label="leaf" className="feature-icon">
              🌱
            </span>
            <h3>100% Organic</h3>
            <p>All our products are certified organic and chemical-free.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="star" className="feature-icon">
              ⭐
            </span>
            <h3>Best Quality</h3>
            <p>Handpicked, fresh, and delivered with care for your family.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="truck" className="feature-icon">
              🚚
            </span>
            <h3>Fast Delivery</h3>
            <p>Get your order delivered quickly and safely to your home.</p>
          </div>
        </div>
      </section>

      <svg
        className="section-separator"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C480,80 960,-20 1440,60 L1440,60 L0,60 Z"
          fill="#f7faf5"
        />
      </svg>

      <section className="section-block featured">
        <h2>Featured Products</h2>
        {loading ? (
          <div
            style={{ textAlign: "center", color: "#6cb33f", fontWeight: 700 }}
          >
            Loading...
          </div>
        ) : (
          <div className="products-row">
            {featured.length === 0 && (
              <div style={{ color: "#888" }}>No featured products.</div>
            )}
            {featured.map((product, idx) => (
              <div className="product-card-anim" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <svg
        className="section-separator"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 C480,80 960,-20 1440,60 L1440,60 L0,60 Z" fill="#fff" />
      </svg>

      <section className="section-block best">
        <h2>Best Sellers</h2>
        {loading ? (
          <div
            style={{ textAlign: "center", color: "#6cb33f", fontWeight: 700 }}
          >
            Loading...
          </div>
        ) : (
          <div className="products-row">
            {bestsellers.length === 0 && (
              <div style={{ color: "#888" }}>No best sellers.</div>
            )}
            {bestsellers.map((product, idx) => (
              <div className="product-card-anim" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      <svg
        className="section-separator"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 C480,80 960,-20 1440,60 L1440,60 L0,60 Z"
          fill="#f7faf5"
        />
      </svg>

      <BlogSection />
    </div>
  );
};

export default Home;
