import React from 'react';
import ProductCard from './productCart/ProductCard';

const BestSellers = ({ items, onAdd }) => (
  <section className="best-sellers">
    <h2>محصولات پرفروش</h2>
    <div className="product-strip">
      {items.map(p => (
        <ProductCard
          key={p.id}
          title={p.title}
          price={p.price}
          img={p.img}
          onAdd={() => onAdd(p)}
        />
      ))}
    </div>
  </section>
);

export default BestSellers;