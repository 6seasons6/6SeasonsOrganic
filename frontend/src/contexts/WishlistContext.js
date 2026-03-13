import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/wishlist/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setWishlist(data.items || []));
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = async (item) => {
    if (!user) return;
    setLoading(true);
    await fetch(`http://localhost:5000/api/wishlist/${user.uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setWishlist((prev) => (prev.some((i) => i._id === item._id) ? prev : [...prev, item]));
    setLoading(false);
  };

  const removeFromWishlist = async (itemId) => {
    if (!user) return;
    setLoading(true);
    await fetch(`http://localhost:5000/api/wishlist/${user.uid}/${itemId}`, {
      method: "DELETE",
    });
    setWishlist((prev) => prev.filter((i) => i._id !== itemId));
    setLoading(false);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}
