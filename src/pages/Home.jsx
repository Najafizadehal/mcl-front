import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import p1 from '../assets/product/s24.png';
import iconParts from '../assets/icons/smallpart.png';
import iconLCD from '../assets/icons/lcd.png';
import iconAcc from '../assets/icons/accesories.png';
import iconTools from '../assets/icons/tools.png';
import { fetchProducts } from '../services/productService';

const categories = [
  { id: 1, label: 'قطعات ریز', icon: iconParts },
  { id: 2, label: 'ال سی دی', icon: iconLCD },
  { id: 3, label: 'جانبی', icon: iconAcc },
  { id: 4, label: 'ابزارآلات', icon: iconTools },
];

const positions = [
  { x: 200, y: 166, id: 1 },
  { x: 350, y: 152, id: 2 },
  { x: 500, y: 163, id: 3 },
  { x: 650, y: 199, id: 4 },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('خطا در دریافت محصولات');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAdd = item => console.log('افزودن به سبد:', item.name);
  const handleCategory = cat => console.log('دسته:', cat.label);
  const handleSearch = text => console.log('جست‌وجو:', text);

  return (
    <div className="home2">
      <Navbar onSearch={handleSearch} />
      <Hero categories={categories} positions={positions} onCategoryClick={handleCategory} />
      {loading ? (
        <p className="loading-text">در حال بارگذاری محصولات...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <BestSellers items={products.map(p => ({
          id: p.id || p.name, // اگر id نداریم از name استفاده می‌کنیم
          title: p.name,
          price: Number(p.price).toLocaleString(),
          img: p.imageUrl,
        }))} onAdd={handleAdd} />
      )}
      <Footer />
    </div>
  );
};

export default Home;
