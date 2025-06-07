import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import p1 from '../assets/product/s24.png';
import iconParts from '../assets/icons/smallpart.png';
import iconLCD from '../assets/icons/lcd.png';
import iconAcc from '../assets/icons/accesories.png';
import iconTools from '../assets/icons/tools.png';

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

const positions = [
  { x: 200, y: 166, id: 1 },
  { x: 350, y: 152, id: 2 },
  { x: 500, y: 163, id: 3 },
  { x: 650, y: 199, id: 4 },
];

const Home = () => {
  const handleAdd = item => console.log('افزودن به سبد:', item.title);
  const handleCategory = cat => console.log('دسته:', cat.label);
  const handleSearch = text => console.log('جست‌وجو:', text);

  return (
    <div className="home2">
      <Navbar onSearch={handleSearch} />
      <Hero categories={categories} positions={positions} onCategoryClick={handleCategory} />
      <BestSellers items={bestSellers} onAdd={handleAdd} />
      <Footer />
    </div>
  );
};

export default Home;