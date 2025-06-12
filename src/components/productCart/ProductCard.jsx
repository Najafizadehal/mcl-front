// ProductCard.jsx
import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ title, price, img, onAdd }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // اگر تصویر خطا داد، از یک تصویر پیش‌فرض استفاده کن
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        {!imageLoaded && (
          <div className="image-placeholder">
            <div className="loading-spinner" />
          </div>
        )}
        <img
          src={imageError ? '/placeholder.png' : img}
          alt={title}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          style={{ display: imageLoaded ? 'block' : 'none' }}
          loading="lazy"  // لود تنبل تصاویر
          decoding="async"  // دیکد کردن تصاویر به صورت ناهمگام
        />
      </div>
      <h3>{title}</h3>
      <p className="price">{price} تومان</p>
      <button className="add-btn" onClick={onAdd}>افزودن به سبد</button>
    </div>
  );
};

export default ProductCard;
