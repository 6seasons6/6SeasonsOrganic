import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${user?.uid}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchOrders();
  }, [user]);

  const handleReorder = (products) => {
    products.forEach(product => addToCart(product));
  };

  if (loading) return <div className="order-history-loading">Loading...</div>;
  if (error) return <div className="order-history-error">{error}</div>;

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <div className="order-history-empty">No previous orders found.</div>
      ) : (
        <ul className="order-history-list">
          {orders.map(order => (
            <li key={order._id} className="order-history-item">
              <div className="order-history-meta">
                <span>Order Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Status: {order.status}</span>
                <span>Total: ₹{order.total}</span>
              </div>
              <div className="order-history-products">
                <h4>Products:</h4>
                <ul>
                  {(order.cart || []).map((p, idx) => (
                    <li key={idx} className="order-history-product">
                      {/* If imageUrl is not present, show a placeholder */}
                      <img src={p.imageUrl || 'https://via.placeholder.com/48x48?text=No+Image'} alt={p.name} className="order-history-product-img" />
                      <span>{p.name}</span>
                      <span>Qty: {p.qty}</span>
                      <span>₹{p.discountedPrice || p.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="order-history-reorder-btn" onClick={() => handleReorder(order.cart || [])}>
                Reorder
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
