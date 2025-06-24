// ProductCard.jsx
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ title, price, img, onAdd, quantity, onIncrement, onDecrement }) => (
  <div className="product-card">
    <div className="product-card__image-wrapper">
      <img src={img} alt={title} />
    </div>
    <h3>{title}</h3>
    <p className="price">{price} تومان</p>
    {quantity > 0 ? (
      <div className="cart-qty-controls">
        <button className="qty-btn" onClick={onDecrement}>-</button>
        <span className="qty-value">{quantity}</span>
        <button className="qty-btn" onClick={onIncrement}>+</button>
      </div>
    ) : (
      <button className="add-btn" onClick={onAdd}>افزودن به سبد</button>
    )}
  </div>
);

export default ProductCard;
