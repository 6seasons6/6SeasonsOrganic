import React, { useState } from "react";
import "./Home.css";
import { FaLeaf, FaSeedling, FaCube, FaHotjar } from "react-icons/fa";

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

export default function SampleLead() {
  const [activeTab, setActiveTab] = useState("honey");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddProduct = (prod) => {
    if (!selectedProducts.find((p) => p.id === prod.id)) {
      setSelectedProducts([...selectedProducts, prod]);
    }
  };
  const handleRemoveProduct = (prod) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== prod.id));
  };

  return (
    <div className="sample-lead-bg">
      <div className="sample-lead-card">
        <img
          src={require("../assets/logo.png")}
          alt="Logo"
          className="sample-lead-logo"
        />
        <h2 className="sample-lead-title">Why Try 6 Seasons Organic Honey?</h2>
        <div className="sample-lead-desc">
          The story of our honey is rooted in our chemical-free farms. Our
          farmers work closely with the land and bees to bring you organic honey
          and products that are always nutritious by nature.
        </div>
        <div className="sample-lead-features">
          <div className="sample-lead-feature">
            <FaLeaf size={32} color="#6cb33f" />
            <div>Trained Organic Farmers</div>
          </div>
          <div className="sample-lead-feature">
            <FaSeedling size={32} color="#6cb33f" />
            <div>Chemical-free soil & fodder</div>
          </div>
          <div className="sample-lead-feature">
            <FaHotjar size={32} color="#e2b007" />
            <div>Raw Organic Honey</div>
          </div>
          <div className="sample-lead-feature">
            <FaCube size={32} color="#6cb33f" />
            <div>Other Organic Products</div>
          </div>
        </div>
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
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
