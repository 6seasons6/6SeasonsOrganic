
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './ProductDetail.css';

import { useWishlist } from '../contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, loading: wishlistLoading } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewUser, setReviewUser] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/reviews/${id}`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
      } catch {
        setReviews([]);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    if (!reviewUser || !reviewComment) {
      setReviewError('Name and comment are required.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          user: reviewUser,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setReviewSuccess('Review submitted!');
      setReviewUser('');
      setReviewRating(5);
      setReviewComment('');
      // Refresh reviews
      const reviewsRes = await fetch(`http://localhost:5000/api/reviews/${id}`);
      setReviews(await reviewsRes.json());
    } catch {
      setReviewError('Failed to submit review');
    }
  };

  if (loading) return <div className="product-detail-loading">Loading...</div>;
  if (error) return <div className="product-detail-error">{error}</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/signin', { state: { from: location } });
      return;
    }
    addToCart(product);
  };

  const handleAddToWishlist = () => {
    if (!user) {
      navigate('/signin', { state: { from: location } });
      return;
    }
    addToWishlist(product);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-img-wrap" style={{position:'relative'}}>
        {product.discountedPrice && product.discountedPrice < product.price && (
          <div className="product-discount-badge" style={{position:'absolute',top:16,right:16,background:'linear-gradient(90deg,#e53935,#ffe066 90%)',color:'#fff',fontSize:'1.1rem',fontWeight:800,padding:'7px 18px',borderRadius:'1.2rem 1.2rem 1.2rem 0',boxShadow:'0 2px 8px rgba(229,57,53,0.10)',zIndex:2,letterSpacing:1,animation:'badgePop 0.7s cubic-bezier(.23,1.01,.32,1) both'}}>
            -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
          </div>
        )}
        <img src={product.imageUrl} alt={product.name} className="product-detail-img" />
      </div>
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-detail-desc">{product.description}</p>
        <div className="product-detail-meta">
          <span className="product-detail-weight">{product.weight}</span>
          <span className="product-detail-category">{product.category}</span>
        </div>
        <div className="product-detail-pricing">
          {product.discountedPrice && product.discountedPrice < product.price ? (
            <>
              <span className="product-price-strike">₹{product.price}</span>
              <span className="product-discounted">₹{product.discountedPrice}</span>
              <span className="product-discount-percent">
                -{Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="product-price">₹{product.price}</span>
          )}
        </div>

  <div style={{ display: 'flex', gap: 16, margin: '18px 0' }}>
    <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
    <button
      className="wishlist-heart-btn"
      onClick={handleAddToWishlist}
      disabled={wishlistLoading || wishlist?.some((i) => i._id === product._id)}
      aria-label={wishlist?.some((i) => i._id === product._id) ? 'Wishlisted' : 'Add to Wishlist'}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        marginLeft: 8,
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

        {/* Reviews Section */}
        <div className="product-reviews-section">
          <h3>Reviews</h3>
          {reviews.length === 0 && <div className="product-no-reviews">No reviews yet.</div>}
          <ul className="product-reviews-list">
            {reviews.map((r, idx) => (
              <li key={idx} className="product-review-item">
                <div className="product-review-header">
                  <span className="product-review-user">{r.user}</span>
                  <span className="product-review-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="product-review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="product-review-comment">{r.comment}</div>
              </li>
            ))}
          </ul>
          <form className="product-review-form" onSubmit={handleReviewSubmit}>
            <h4>Leave a Review</h4>
            <input
              type="text"
              placeholder="Your Name"
              value={reviewUser}
              onChange={e => setReviewUser(e.target.value)}
              required
            />
            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
            </select>
            <textarea
              placeholder="Your Review"
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
            {reviewError && <div className="product-review-error">{reviewError}</div>}
            {reviewSuccess && <div className="product-review-success">{reviewSuccess}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
