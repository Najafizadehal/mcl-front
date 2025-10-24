import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlistProducts, removeFromWishlist } from '../services/wishlistService';
import '../styles/Wishlist.css';

const Wishlist = ({ onAdd, cart, onIncrement, onDecrement }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await getWishlistProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError('خطا در بارگذاری لیست علاقه‌مندی‌ها');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setProducts(products.filter(p => p.id !== productId));
      window.showAlert?.('محصول از لیست علاقه‌مندی‌ها حذف شد', 'success');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      window.showAlert?.('خطا در حذف محصول', 'error');
    }
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      title: product.name,
      price: Number(product.price).toLocaleString(),
      img: product.imageUrl,
      name: product.name
    };
    onAdd(cartItem);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-error">
          <p>{error}</p>
          <button onClick={loadWishlist}>تلاش مجدد</button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="wishlist-page empty-wishlist">
        <div className="empty-state">
          <div className="empty-icon">💔</div>
          <h2>لیست علاقه‌مندی‌های شما خالی است</h2>
          <p>محصولات مورد علاقه خود را اضافه کنید</p>
          <button className="back-to-shop-btn" onClick={() => navigate('/')}>
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="back-to-home-btn" onClick={() => navigate('/')}>
          ← بازگشت به فروشگاه
        </button>
        <h1>لیست علاقه‌مندی‌های من ❤️</h1>
        <p>{products.length} محصول</p>
      </div>

      <div className="wishlist-grid">
        {products.map(product => {
          const cartQuantity = cart[product.id]?.quantity || 0;
          const isInCart = cartQuantity > 0;

          return (
            <div key={product.id} className="wishlist-item">
              <button 
                className="remove-wishlist-btn"
                onClick={() => handleRemove(product.id)}
                aria-label="حذف از علاقه‌مندی‌ها"
              >
                ✕
              </button>

              <div className="wishlist-item-image" onClick={() => navigate('/')}>
                <img src={product.imageUrl} alt={product.name} />
              </div>

              <div className="wishlist-item-info">
                {product.brand && (
                  <span className="wishlist-item-brand">{product.brand}</span>
                )}
                <h3 className="wishlist-item-title">{product.name}</h3>
                
                {product.averageRating > 0 && (
                  <div className="wishlist-item-rating">
                    <span className="stars">
                      {'★'.repeat(Math.round(product.averageRating))}
                      {'☆'.repeat(5 - Math.round(product.averageRating))}
                    </span>
                    <span className="rating-value">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}

                <p className="wishlist-item-price">
                  {Number(product.price).toLocaleString()} تومان
                </p>

                {product.stockQuantity !== undefined && (
                  <div className="wishlist-item-stock">
                    {product.stockQuantity > 0 ? (
                      <span className="in-stock">✓ موجود</span>
                    ) : (
                      <span className="out-of-stock">✕ ناموجود</span>
                    )}
                  </div>
                )}

                {isInCart ? (
                  <div className="wishlist-qty-controls">
                    <button onClick={() => onDecrement({ ...product, title: product.name, price: Number(product.price).toLocaleString(), img: product.imageUrl })}>-</button>
                    <span>{cartQuantity}</span>
                    <button onClick={() => onIncrement({ ...product, title: product.name, price: Number(product.price).toLocaleString(), img: product.imageUrl })}>+</button>
                  </div>
                ) : (
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity <= 0}
                  >
                    {product.stockQuantity > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;

