import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutRequest } from '../services/authService';
import productsIcon from '../assets/icons/products.png';


// ⬇️ URL تصویر آنلاین یا CDN
const PROFILE_URL = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3Y5MzctYWV3LTEzOS5qcGc.jpg';

const Navbar = ({ onSearch, cart, cartItems, onIncrement, onDecrement }) => {
  const [open, setOpen]   = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef           = useRef(null);
  const cartBtnRef        = useRef(null);
  const cartPopupRef      = useRef(null);
  const navigate          = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* بستن منو با کلیک بیرون */
  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (cartPopupRef.current && !cartPopupRef.current.contains(e.target)) setCartPopupOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  /* خروج */
  const handleLogout = async () => {
    try { await logoutRequest(); } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleCartClick = () => {
    setCartPopupOpen(!cartPopupOpen);
  };

  const handleViewCart = () => {
    setCartPopupOpen(false);
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    setCartPopupOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      {/* ───── راستِ نوار: برند ───── */}
      <div className="brand-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <h1 className="brand">Mobile Center Lamerd</h1>
        
        <button className="wishlist-nav-btn" onClick={() => navigate('/wishlist')} aria-label="لیست علاقه‌مندی‌ها" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', fontSize: '28px', padding: '4px' }}>
          ❤️
        </button>
        
        <div ref={cartPopupRef} style={{ position: 'relative' }}>
          <button ref={cartBtnRef} className="cart-btn" onClick={handleCartClick} aria-label="سبد خرید" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <img src={productsIcon} alt="cart" className="cart-icon" style={{ width: 32, height: 32 }} />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            )}
          </button>

          {/* Cart Popup */}
          {cartPopupOpen && (
            <div className="cart-popup">
              <div className="cart-popup-header">
                <h3>سبد خرید شما</h3>
                <button 
                  className="cart-popup-close" 
                  onClick={() => setCartPopupOpen(false)}
                  aria-label="بستن"
                >
                  ×
                </button>
              </div>
              
              <div className="cart-popup-content">
                {cartItems.length === 0 ? (
                  <p className="cart-empty-message">سبد خرید شما خالی است</p>
                ) : (
                  <>
                    <div className="cart-items-preview">
                      {cartItems.slice(0, 3).map(item => (
                        <div key={item.id} className="cart-preview-item">
                          <img src={item.imageUrl} alt={item.title} className="cart-preview-image" />
                          <div className="cart-preview-info">
                            <span className="cart-preview-title">{item.title}</span>
                            <span className="cart-preview-quantity">تعداد: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="cart-more-items">و {cartItems.length - 3} آیتم دیگر...</p>
                      )}
                    </div>
                    
                    <div className="cart-popup-total">
                      مجموع: {cartItems.reduce((sum, item) => {
                        const price = typeof item.price === 'string' 
                          ? parseFloat(item.price.replace(/,/g, '')) 
                          : item.price;
                        return sum + (price * item.quantity);
                      }, 0).toLocaleString()} تومان
                    </div>
                  </>
                )}
              </div>
              
              <div className="cart-popup-actions">
                <button 
                  className="cart-popup-btn cart-popup-btn-secondary" 
                  onClick={handleContinueShopping}
                >
                  ادامه خرید
                </button>
                <button 
                  className="cart-popup-btn cart-popup-btn-primary" 
                  onClick={handleViewCart}
                  disabled={cartItems.length === 0}
                >
                  مشاهده کامل سبد خرید
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───── چپِ نوار: نمایش یوزرنیم + پروفایل ───── */}
      <div className="search-group">
        {/* نمایش یوزرنیم */}
        <div className="username-display" style={{ color: '#fff', fontWeight: 600, marginLeft: 16, marginRight: 8,marginTop: 0, fontSize: 16 }}>
          {(() => {
            try {
              const user = JSON.parse(localStorage.getItem('user'));
              return user?.username || 'کاربر';
            } catch {
              return 'کاربر';
            }
          })()}
        </div>
        <div className="profile-wrapper" ref={menuRef}>
          <button
            className="profile-btn"
            aria-label="Profile"
            onClick={() => setOpen(o => !o)}
          >
            <img src={PROFILE_URL} alt="user" />
          </button>

          {open && (
            <ul className="profile-menu">
              <li onClick={() => { navigate('/profile'); setOpen(false); }}>پروفایل</li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  خروج
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

    </header>
  );
};

export default Navbar;
