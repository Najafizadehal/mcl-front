// ProductCard.jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ title, price, img, onAdd }) => (
  <div className="product-card">
    <div className="product-card__image-wrapper">
      <img src={img} alt={title} />
    </div>
    <h3>{title}</h3>
    <p className="price">{price} تومان</p>
    <button className="add-btn" onClick={onAdd}>افزودن به سبد</button>
  </div>
);

export default ProductCard;
