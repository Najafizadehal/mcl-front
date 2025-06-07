import React from 'react';
import './Home.css';
import heroImg from './assets/hero.png';
import p1 from './assets/product/s24.png';
import iconParts from './assets/icons/smallpart.png';
import iconLCD from './assets/icons/lcd.png';
import iconAcc from './assets/icons/accesories.png';
import iconTools from './assets/icons/tools.png';
import ProductCard from '../components/productCart/ProductCard';


const categories = [
  { id: 1, label: 'قطعات ریز', icon: iconParts },
  { id: 2, label: 'ال سی دی', icon: iconLCD },
  { id: 3, label: 'جانبی', icon: iconAcc },
  { id: 4, label: 'ابزارآلات', icon: iconTools },
];

const bestSellers = [
  { id: 1, title: 'iPhone 15 Pro', price: '65,000,000', img: 'https://via.placeholder.com/200x140' },
  { id: 2, title: 'Samsung S24 Ultra', price: '58,500,000', img: p1 },
  { id: 3, title: 'Xiaomi 14 Ultra', price: '47,900,000', img: 'https://via.placeholder.com/200x140' },
  { id: 4, title: 'Honor Magic 6', price: '39,800,000', img: 'https://via.placeholder.com/200x140' },
];

const categoryPositions = [
  { x: 200, y: 166, id: 1 },
  { x: 350, y: 152, id: 2 },
  { x: 500, y: 163, id: 3 },
  { x: 650, y: 199, id: 4 },
];

const Home = () => {
  return (
    <div className="home2">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand-menu">
          <h1 className="brand">Mobile Center Lamerd</h1>
          <button className="menu-btn" aria-label="Menu">☰</button>
        </div>
        <input className="search" type="text" placeholder="جست‎وجو کنید" />
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src={heroImg} alt="Hero Background" className="hero-bg" />
        <svg className="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            d="M0 224 C 240 128 480 128 720 224 C 960 320 1200 320 1440 224 L1440 320H0Z"
            fill="#ffffff"
          />
          <g className="wave-category-icons">
            {categoryPositions.map((pos) => {
              const category = categories.find((c) => c.id === pos.id);
              return (
                <g
                  key={pos.id}
                  className="cat-btn"
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => console.log('دسته', category.label)}
                >
                  <circle cx="0" cy="0" r="40" fill="var(--green)" />
                  <image href={category.icon} x="-20" y="-18" width="36" height="36" />
                  <text x="0" y="66" fontSize="17" fill="var(--green)" textAnchor="middle">
                    {category.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </section>

      {/* Best Sellers */}
      <section className="best-sellers">
        <h2>محصولات پرفروش</h2>
        <div className="product-strip">
          {bestSellers.map(p => (
            <ProductCard
              key={p.id}
              title={p.title}
              price={p.price}
              img={p.img}
              onAdd={() => console.log('افزودن به سبد:', p.title)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <svg className="footer-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            d="M0 0 L48 10.7 C96 21 192 43 288 64 C384 85 480 107 576 138.7 C672 171 768 213 864 197.3 C960 181 1056 107 1152 90.7 C1248 75 1344 117 1392 138.7 L1440 160 V0 H0 Z"
            fill="#ffffff"
          />
        </svg>
        <div className="footer-inner">
          <p>موبایل سنتر لامرد</p>
          <p>تلفن: ۰۷۱-۳۴۵۶۷۸۹</p>
          <p>ایمیل: info@example.com</p>
          <p>آدرس: خیابان مثال</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;