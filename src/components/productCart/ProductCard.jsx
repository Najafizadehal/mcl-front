// ProductCard.jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ 
  title, 
  price, 
  img, 
  onAdd, 
  quantity, 
  onIncrement, 
  onDecrement, 
  onImageClick, 
  active = true,
  stockQuantity,
  averageRating,
  reviewCount,
  brand,
  isInWishlist = false,
  onToggleWishlist
}) => {
  // تابع نمایش ستاره‌ها
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  const isOutOfStock = stockQuantity !== undefined && stockQuantity <= 0;
  const isLowStock = stockQuantity !== undefined && stockQuantity > 0 && stockQuantity <= 5;

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper" style={{ cursor: onImageClick ? 'pointer' : undefined, position: 'relative' }}>
        <img src={img} alt={title} onClick={onImageClick} style={{ opacity: active && !isOutOfStock ? 1 : 0.4, filter: active && !isOutOfStock ? 'none' : 'grayscale(60%)' }} />
        
        {onToggleWishlist && (
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            aria-label={isInWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>
        )}
        
        {!active && <div className="product-card__badge badge-inactive">غیرفعال</div>}
        {isOutOfStock && <div className="product-card__badge badge-out-of-stock">ناموجود</div>}
        {isLowStock && <div className="product-card__badge badge-low-stock">فقط {stockQuantity} عدد!</div>}
        {averageRating && averageRating >= 4.5 && <div className="product-card__badge badge-popular">⭐ محبوب</div>}
      </div>
      
      <div className="product-card__content">
        {/* نمایش برند */}
        {brand && <div className="product-card__brand">{brand}</div>}
        
        <h3 className="product-card__title">{title}</h3>
        
        {averageRating !== undefined && averageRating > 0 && (
          <div className="product-card__rating">
            <div className="stars">
              {renderStars(averageRating)}
            </div>

          </div>
        )}
        
        <p className="price">{price} تومان</p>
        
        {/* نمایش موجودی */}
        {stockQuantity !== undefined && (
          <div className="product-card__stock">
            {isOutOfStock ? (
              <span className="stock-status out-of-stock">ناموجود</span>
            ) : isLowStock ? (
              <span className="stock-status low-stock">موجودی کم</span>
            ) : (
              <span className="stock-status in-stock">موجود</span>
            )}
          </div>
        )}
        
        {/* دکمه های خرید */}
        {quantity > 0 ? (
          <div className="cart-qty-controls">
            <button className="qty-btn" onClick={onDecrement}>-</button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn" onClick={onIncrement}>+</button>
          </div>
        ) : (
          <button 
            className="add-btn" 
            onClick={onAdd}
            disabled={isOutOfStock || !active}
          >
            {isOutOfStock ? 'ناموجود' : 'افزودن به سبد'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
