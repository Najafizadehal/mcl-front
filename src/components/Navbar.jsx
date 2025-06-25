import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutRequest } from '../services/authService';
import { Link } from 'react-router-dom';
import productsIcon from '../assets/icons/products.png';
import { createOrder } from '../services/orderService';


// ⬇️ URL تصویر آنلاین یا CDN
const PROFILE_URL = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3Y5MzctYWV3LTEzOS5qcGc.jpg';

const Navbar = ({ onSearch, cart, cartItems, onIncrement, onDecrement }) => {
  const [open, setOpen]   = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef           = useRef(null);
  const cartBtnRef        = useRef(null);
  const [cartModalStyle, setCartModalStyle] = useState({});
  const navigate          = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
      // اگر کلیک خارج از modal و cartBtn بود، ببند
      const modal = document.querySelector('.cart-modal');
      if (
        modal && !modal.contains(e.target) &&
        cartBtnRef.current && !cartBtnRef.current.contains(e.target)
      ) {
        setCartOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // موقعیت‌دهی کارت سبد خرید زیر آیکون سبد خرید
  useEffect(() => {
    if (cartOpen && cartBtnRef.current) {
      const rect = cartBtnRef.current.getBoundingClientRect();
      const modalWidth = 270;
      let left = rect.left + rect.width - modalWidth;
      // اگر از صفحه بیرون زد، از سمت چپ آیکون باز شود
      if (left < 8) left = rect.left;
      setCartModalStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left,
        zIndex: 1000,
        minWidth: 250,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: 8,
        padding: 20
      });
    }
  }, [cartOpen]);

  /* خروج */
  const handleLogout = async () => {
    try { await logoutRequest(); } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  async function handleCheckout() {
    if (cartItems.length === 0 || checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const items = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
      const response = await createOrder(items);
      if (response.success) {
        window.showAlert?.('سفارش با موفقیت ثبت شد!', 'success');
        setCartOpen(false);
        // پاک کردن سبد خرید (در App باید هندل شود)
        window.dispatchEvent(new CustomEvent('clear-cart'));
      } else {
        window.showAlert?.(response.message || 'خطا در ثبت سفارش', 'error');
      }
    } catch (e) {
      console.error('خطا در ثبت سفارش:', e);
      window.showAlert?.('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      {/* ───── راستِ نوار: برند ───── */}
      <div className="brand-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        <h1 className="brand">Mobile Center Lamerd</h1>
        <button ref={cartBtnRef} className="cart-btn" onClick={() => setCartOpen(o => !o)} aria-label="سبد خرید" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
          <img src={productsIcon} alt="cart" className="cart-icon" style={{ width: 32, height: 32 }} />
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          )}
        </button>
      </div>

      {/* ───── چپِ نوار: جست‌وجو + پروفایل ───── */}
      <div className="search-group">
        <input
          className="search"
          type="text"
          placeholder="جست‎وجو کنید"
          onKeyDown={e => e.key === 'Enter' && onSearch?.(e.target.value)}
        />

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

      {/* کارت سبد خرید */}
      {cartOpen && (
        <div
          className="cart-modal"
          style={{
            ...cartModalStyle,
            height: undefined,
            maxHeight: cartItems.length > 5 ? 400 : undefined,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={e => e.stopPropagation()}
        >
          <button className="cart-close-btn" onClick={() => setCartOpen(false)} style={{ position: 'absolute', left: 10, top: 10, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }} aria-label="بستن">×</button>
          <h3 style={{ marginTop: 0 }}>سبد خرید</h3>
          {cartItems.length === 0 ? (
            <div className="cart-empty">سبد خرید شما خالی است.</div>
          ) : (
            <>
              <div
                className="cart-list"
                style={{
                  flex: cartItems.length > 5 ? 1 : undefined,
                  overflowY: cartItems.length > 5 ? 'auto' : 'visible',
                  marginBottom: 8
                }}
              >
                {cartItems.map(item => (
                  <div className="cart-item" key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={item.img || item.imageUrl} alt={item.title || item.name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }} />
                      <span style={{ fontSize: 14 }}>{item.title || item.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button className="qty-btn" onClick={e => { e.stopPropagation(); onDecrement(item);}}>-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={e => { e.stopPropagation(); onIncrement(item);}}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="cart-checkout-btn"
                style={{ width: '100%', marginTop: 8, background: 'var(--green, #1dbf73)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: '1rem', cursor: checkoutLoading ? 'not-allowed' : 'pointer', opacity: checkoutLoading ? 0.7 : 1 }}
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'در حال ثبت سفارش...' : 'نهایی کردن خرید'}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
