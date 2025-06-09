import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutRequest } from '../services/authService';

// ⬇️ URL تصویر آنلاین یا CDN
const PROFILE_URL = 'https://static.thenounproject.com/png/1594252-200.png';

const Navbar = ({ onSearch }) => {
  const [open, setOpen]   = useState(false);
  const menuRef           = useRef(null);
  const navigate          = useNavigate();

  /* بستن منو با کلیک بیرون */
  useEffect(() => {
    const close = e =>
      menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  /* خروج */
  const handleLogout = async () => {
    try { await logoutRequest(); } catch (_) {}
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      {/* ======== راست: برند + پروفایل ======== */}
      <div className="navbar-brand-menu">
        <h1 className="brand">Mobile Center Lamerd</h1>

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
              <li onClick={() => navigate('/profile')}>پروفایل من</li>
              <li onClick={handleLogout}>خروج</li>
            </ul>
          )}
        </div>
      </div>

      {/* ======== چپ: سرچ ======== */}
      <input
        className="search"
        type="text"
        placeholder="جست‎وجو کنید"
        onKeyDown={e => e.key === 'Enter' && onSearch?.(e.target.value)}
      />
    </header>
  );
};

export default Navbar;
