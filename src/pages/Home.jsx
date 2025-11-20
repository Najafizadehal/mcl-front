import React, { useEffect, useState, useCallback } from 'react';
import '../styles/Home.css';
// import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BestSellers from '../components/BestSellers';
import Footer from '../components/Footer';
import SkeletonCard from '../components/common/SkeletonCard';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import iconParts from '../assets/icons/smallpart.png';
// import iconLCD from '../assets/icons/lcd.png';
import iconAcc from '../assets/icons/accesories.png';
import iconTools from '../assets/icons/repair.png';
import iconMobile from '../assets/icons/mobile.png';
import { getAllProducts as fetchProducts, getProductById } from '../services/productService';
import { createOrUpdateReview, getProductReviews, deleteReview } from '../services/reviewService';
import { addToWishlist, removeFromWishlist, getWishlistProducts } from '../services/wishlistService';

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
  
  // فیلترهای جدید
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // state های مربوط به نظرات
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // state های مربوط به wishlist
  const [wishlistStatus, setWishlistStatus] = useState({});

  const loadProducts = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    try {
      // ساخت پارامترهای فیلتر
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (sortBy) params.append('sort', sortBy);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      if (inStockOnly) params.append('inStockOnly', 'true');
      
      const data = await fetchProducts(type, params);
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  }, [sortBy, priceRange.min, priceRange.max, inStockOnly]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  useEffect(() => {
    const loadWishlistStatus = async () => {
      if (products.length === 0) {
        setWishlistStatus({});
        return;
      }
      try {
        const wishlistItems = await getWishlistProducts();
        const ids = new Set((wishlistItems || []).map(p => p.id));
        const statusMap = {};
        products.forEach(p => {
          statusMap[p.id] = ids.has(p.id);
        });
        setWishlistStatus(statusMap);
      } catch (err) {
        console.error('Error loading wishlist status:', err);
        setWishlistStatus({});
      }
    };
    loadWishlistStatus();
  }, [products]);

  const handleCategory = (cat) => {
    const newSelected = selectedId === cat.id ? null : cat.id;
    setSelectedId(newSelected);
    loadProducts(newSelected ? cat.type : null);
  };

  // نمایش پاپ‌آپ اطلاعات کامل محصول
  const handleProductClick = async (product) => {
    setModalLoading(true);
    setReviewsLoading(true);
    try {
      // اگر اطلاعات کامل نیست، از سرور بگیر
      const fullProduct = await getProductById(product.id);
      setModalProduct(fullProduct);
      
      try {
        const productReviews = await getProductReviews(product.id);
        setReviews(productReviews || []);
      } catch (reviewErr) {
        console.error('خطا در دریافت نظرات:', reviewErr);
        setReviews([]);
      }
    } catch (err) {
      setModalProduct({ ...product, error: 'خطا در دریافت اطلاعات محصول' });
    } finally {
      setModalLoading(false);
      setReviewsLoading(false);
    }
  };
  
  const closeModal = () => {
    setModalProduct(null);
    setReviews([]);
  };
  
  const handleSubmitReview = async (rating, comment) => {
    if (!modalProduct?.id) return;
    
    try {
      await createOrUpdateReview(modalProduct.id, rating, comment);
      const updatedReviews = await getProductReviews(modalProduct.id);
      setReviews(updatedReviews || []);
      const updatedProduct = await getProductById(modalProduct.id);
      setModalProduct(updatedProduct);
      loadProducts(selectedId ? categories.find(c => c.id === selectedId)?.type : null);
      window.showAlert?.('نظر شما با موفقیت ثبت شد!', 'success');
    } catch (error) {
      console.error('خطا در ثبت نظر:', error);
      const errorMessage = error.response?.data?.message || 'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.';
      window.showAlert?.(errorMessage, 'error');
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('آیا از حذف این نظر اطمینان دارید؟')) return;
    
    try {
      await deleteReview(reviewId);
      const updatedReviews = await getProductReviews(modalProduct.id);
      setReviews(updatedReviews || []);
      const updatedProduct = await getProductById(modalProduct.id);
      setModalProduct(updatedProduct);
      loadProducts(selectedId ? categories.find(c => c.id === selectedId)?.type : null);
      window.showAlert?.('نظر با موفقیت حذف شد', 'success');
    } catch (error) {
      console.error('خطا در حذف نظر:', error);
      window.showAlert?.('خطا در حذف نظر', 'error');
    }
  };

  const handleToggleWishlist = async (productId) => {
    const isCurrentlyInWishlist = wishlistStatus[productId];
    
    try {
      if (isCurrentlyInWishlist) {
        await removeFromWishlist(productId);
        setWishlistStatus(prev => ({ ...prev, [productId]: false }));
        window.showAlert?.('محصول از لیست علاقه‌مندی‌ها حذف شد', 'info');
      } else {
        await addToWishlist(productId);
        setWishlistStatus(prev => ({ ...prev, [productId]: true }));
        window.showAlert?.('محصول به لیست علاقه‌مندی‌ها اضافه شد', 'success');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      window.showAlert?.('خطا در به‌روزرسانی لیست علاقه‌مندی‌ها', 'error');
    }
  };

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
      
      {/* بخش جستجو و فیلترها */}
      <div className="filter-section">
        <div className="search-filter-container">
          {/* سرچ باکس */}
          <input
            className="search-input"
            type="text"
            placeholder="🔍 جستجوی محصول..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          
          {/* دکمه نمایش فیلترها */}
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '✕ بستن فیلترها' : '⚙️ فیلترها'}
          </button>
        </div>
        
        {/* فیلترهای پیشرفته */}
        {showFilters && (
          <div className="advanced-filters">
            {/* مرتب‌سازی */}
            <div className="filter-group">
              <label>مرتب‌سازی:</label>
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="">پیش‌فرض</option>
                <option value="price_asc">ارزان‌ترین</option>
                <option value="price_desc">گران‌ترین</option>
                <option value="rating">بالاترین امتیاز</option>
                <option value="popular">محبوب‌ترین</option>
              </select>
            </div>
            
            {/* محدوده قیمت */}
            <div className="filter-group">
              <label>محدوده قیمت (تومان):</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="از"
                  value={priceRange.min}
                  onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="price-input"
                />
                <span>تا</span>
                <input
                  type="number"
                  placeholder="تا"
                  value={priceRange.max}
                  onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="price-input"
                />
              </div>
            </div>
            
            {/* فقط موجود */}
            <div className="filter-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                />
                <span>فقط کالاهای موجود</span>
              </label>
            </div>
            
            {/* دکمه پاک کردن فیلترها */}
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSortBy("");
                setPriceRange({ min: "", max: "" });
                setInStockOnly(false);
              }}
            >
              پاک کردن فیلترها
            </button>
          </div>
        )}
      </div>
      
      {/* نمایش محصولات */}
      {loading ? (
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <BestSellers
          items={filteredProducts.map(p => ({
            id: p.id,
            title: p.name,
            priceValue: Number(p.price),
            priceText: Number(p.price).toLocaleString(),
            img: p.imageUrl,
            description: p.description,
            productType: p.productType,
            stockQuantity: p.stockQuantity,
            averageRating: p.averageRating,
            reviewCount: p.reviewCount,
            brand: p.brand,
            isInWishlist: wishlistStatus[p.id] || false,
          }))}
          onAdd={onAdd}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onProductClick={handleProductClick}
          onToggleWishlist={handleToggleWishlist}
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
                {/* اطلاعات محصول */}
                <div className="product-modal-header">
                  <img src={modalProduct.imageUrl} alt={modalProduct.name} className="modal-product-image" />
                  <div className="modal-product-info">
                    <h2>{modalProduct.name}</h2>
                    {modalProduct.brand && (
                      <p className="modal-product-brand">برند: {modalProduct.brand}</p>
                    )}
                    <p className="modal-product-price">{Number(modalProduct.price).toLocaleString()} تومان</p>
                    <p className="modal-product-description">{modalProduct.description || 'بدون توضیحات'}</p>
                    <p className="modal-product-category">دسته‌بندی: {modalProduct.productType}</p>
                    
                    {/* نمایش امتیاز */}
                    {modalProduct.averageRating > 0 && (
                      <div className="modal-product-rating">
                        <span className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.round(modalProduct.averageRating) ? 'filled' : 'empty'}>
                              ★
                            </span>
                          ))}
                        </span>

                      </div>
                    )}
                    
                    {/* موجودی */}
                    {modalProduct.stockQuantity !== undefined && (
                      <p className="modal-product-stock">
                        موجودی: <span className={modalProduct.stockQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
                          {modalProduct.stockQuantity > 0 ? `${modalProduct.stockQuantity} عدد` : 'ناموجود'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                <hr className="modal-divider" />
                
                {/* فرم ثبت نظر */}
                <div className="modal-review-section">
                  <h3 className="section-title">نظر خود را ثبت کنید</h3>
                  <ReviewForm onSubmit={handleSubmitReview} />
                </div>
                
                <hr className="modal-divider" />
                
                {/* لیست نظرات */}
                <div className="modal-reviews-list">
                  {reviewsLoading ? (
                    <p>در حال بارگذاری نظرات...</p>
                  ) : (
                    <ReviewsList 
                      reviews={reviews}
                      currentUserId={(() => {
                        try {
                          const user = JSON.parse(localStorage.getItem('user'));
                          return user?.id;
                        } catch {
                          return null;
                        }
                      })()}
                      onDelete={handleDeleteReview}
                    />
                  )}
                </div>
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
