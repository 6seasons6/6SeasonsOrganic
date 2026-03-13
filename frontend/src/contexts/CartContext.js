import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/api/cart/${user.uid}`)
      .then(res => res.json())
      .then(data => setCart(data.items || []))
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  }, [user]);

  const addToCart = async (product, qty = 1) => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/cart/${user.uid}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product._id, qty })
    });
    const data = await res.json();
    setCart(data.items || []);
    setLoading(false);
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/cart/${user.uid}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    setCart(data.items || []);
    setLoading(false);
  };

  const clearCart = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/cart/${user.uid}/clear`, {
      method: 'POST'
    });
    const data = await res.json();
    setCart(data.items || []);
    setLoading(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + ((item.productId?.discountedPrice || item.productId?.price || 0) * item.qty), 0);

  // For UI, flatten product info
  const cartDisplay = cart.map(item => ({
    ...item.productId,
    qty: item.qty,
    _id: item.productId?._id || item.productId // fallback for old data
  }));

  return (
    <CartContext.Provider value={{ cart: cartDisplay, addToCart, removeFromCart, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
}
