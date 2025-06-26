import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
// import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import iconParts from '../assets/icons/smallpart.png';
// import iconLCD from '../assets/icons/lcd.png';
import iconAcc from '../assets/icons/accesories.png';
import iconTools from '../assets/icons/repair.png';
import iconMobile from '../assets/icons/mobile.png';
import { getAllProducts as fetchProducts, getProductById } from '../services/productService';

const categories = [
  { id: 1, label: 'قطعات ریز', icon: iconParts,  type: 'SMALLPARTS',  size: 64 },
  { id: 2, label: 'ال‌سی‌دی',   icon: iconMobile, type: 'LCD',        size: 64 },
  { id: 3, label: 'جانبی',      icon: iconAcc,    type: 'ACCESSORIES',size: 85 },
  { id: 4, label: 'ابزارآلات',  icon: iconTools,  type: 'REPAIR',     size: 57 },
  { id: 5, label: 'موبایل',     icon: iconMobile, type: 'PHONE',      size: 64 },
];

const positions = [
  { x: 200, y: 166, id: 1 },
  { x: 350, y: 152, id: 2 },
  { x: 500, y: 163, id: 3 },
  { x: 650, y: 199, id: 4 },
  { x: 780, y: 240, id: 5 },
];

const Home = ({ cart, onAdd, onIncrement, onDecrement }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadProducts = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(type);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(); // initial load all
  }, []);

  const handleCategory = (cat) => {
    const newSelected = selectedId === cat.id ? null : cat.id;
    setSelectedId(newSelected);
    loadProducts(newSelected ? cat.type : null);
  };

  // نمایش پاپ‌آپ اطلاعات کامل محصول
  const handleProductClick = async (product) => {
    setModalLoading(true);
    try {
      // اگر اطلاعات کامل نیست، از سرور بگیر
      const fullProduct = await getProductById(product.id);
      setModalProduct(fullProduct);
    } catch (err) {
      setModalProduct({ ...product, error: 'خطا در دریافت اطلاعات محصول' });
    } finally {
      setModalLoading(false);
    }
  };
  const closeModal = () => setModalProduct(null);

  // فیلتر محصولات بر اساس جستجو
  const filteredProducts = products.filter(p =>
    p.name && p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="home2">
      {/* <Navbar onSearch={handleSearch} /> */}
      <Hero
        categories={categories}
        positions={positions}
        onCategoryClick={handleCategory}
        selectedId={selectedId}
      />
      {/* سرچ باکس */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 0 0' }}>
        <input
          className="search"
          type="text"
          placeholder="جستجوی محصول..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ background: '#3fbf9f', color: '#fff', borderRadius: 8, maxWidth: 320 }}
        />
      </div>
      {loading ? (
        <p className="loading-text">در حال بارگذاری محصولات...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <BestSellers
          items={filteredProducts.map(p => ({
            id: p.id,
            title: p.name,
            price: Number(p.price).toLocaleString(),
            img: p.imageUrl,
            description: p.description,
            productType: p.productType,
          }))}
          onAdd={onAdd}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onProductClick={handleProductClick}
        />
      )}
      {/* Modal for product details */}
      {modalProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content product-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            {modalLoading ? (
              <p>در حال بارگذاری اطلاعات محصول...</p>
            ) : modalProduct.error ? (
              <p className="error-text">{modalProduct.error}</p>
            ) : (
              <>
                <img src={modalProduct.imageUrl} alt={modalProduct.name} style={{ maxWidth: 200, borderRadius: 12, marginBottom: 16 }} />
                <h2 style={{ color: '#3fbf9f' }}>{modalProduct.name}</h2>
                <p style={{ fontWeight: 'bold', fontSize: 18 }}>{Number(modalProduct.price).toLocaleString()} تومان</p>
                <p style={{ margin: '12px 0', color: '#444' }}>{modalProduct.description || 'بدون توضیحات'}</p>
                <p style={{ fontSize: 14, color: '#888' }}>دسته‌بندی: {modalProduct.productType}</p>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;