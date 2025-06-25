import React from 'react';
import ProductCard from './productCart/ProductCard';

const BestSellers = ({ items, onAdd, cart, onIncrement, onDecrement }) => (
  <section className="best-sellers">
    {/* <h2>محصولات</h2> */}
    <div className="product-strip">
      {items.map(p => (
        <ProductCard
          key={p.id}
          title={p.title}
          price={p.price}
          img={p.img}
          onAdd={() => onAdd(p)}
          quantity={cart[p.id]?.quantity || 0}
          onIncrement={() => onIncrement(p)}
          onDecrement={() => onDecrement(p)}
        />
      ))}
    </div>
  </section>
);

export default BestSellers;