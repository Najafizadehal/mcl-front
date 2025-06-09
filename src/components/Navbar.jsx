import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as logoutRequest } from '../services/authService';

// ⬇️ URL تصویر آنلاین یا CDN
const PROFILE_URL = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3Y5MzctYWV3LTEzOS5qcGc.jpg';

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
      {/* ───── راستِ نوار: برند ───── */}
      <h1 className="brand">Mobile Center Lamerd</h1>

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
              <li onClick={() => navigate('/profile')}>پروفایل من</li>
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
