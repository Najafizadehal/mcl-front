import React from 'react';
import ProductCard from './productCart/ProductCard';

const BestSellers = ({ items, onAdd, cart, onIncrement, onDecrement, onProductClick, onToggleWishlist }) => {
  // اگر هیچ محصولی نیست
  if (!items || items.length === 0) {
    return (
      <section className="best-sellers">
        <div className="empty-state">
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888', marginTop: 40 }}>
            محصولی یافت نشد.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="best-sellers">
      {/* <h2>محصولات</h2> */}
      <div className="product-strip">
        {items.map(p => (
          <ProductCard
            key={p.id}
            title={p.title}
            price={p.priceText ?? p.price}
            img={p.img}
            onAdd={() => onAdd(p)}
            quantity={cart[p.id]?.quantity || undefined}
            onIncrement={() => onIncrement(p)}
            onDecrement={() => onDecrement(p)}
            onImageClick={() => onProductClick && onProductClick(p)}
            stockQuantity={p.stockQuantity}
            averageRating={p.averageRating}
            reviewCount={p.reviewCount}
            brand={p.brand}
            isInWishlist={p.isInWishlist}
            onToggleWishlist={onToggleWishlist ? () => onToggleWishlist(p.id) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
