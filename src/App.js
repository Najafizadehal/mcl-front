import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home           from './pages/Home';
import Cart           from './pages/Cart';
import Wishlist       from './pages/Wishlist';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Alert from './components/common/Alert';

const PublicOnly = ({ children }) =>
  localStorage.getItem('token') ? <Navigate to="/" replace /> : children;

const CART_STORAGE_KEY = 'cart';

const normalizePrice = (value, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const num = Number(value.replace(/,/g, ''));
    if (Number.isFinite(num)) return num;
  }
  if (value != null) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return fallback;
};

export default function App() {
  const [cart, setCart] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const cartItems = Object.values(cart);

  const showAlert = (message, type = 'success', duration = 4000) => {
    setAlert({ message, type, duration });
  };

  const hideAlert = () => setAlert(null);

  // expose toast globally for legacy callers
  useEffect(() => {
    window.showAlert = showAlert;
    return () => {
      delete window.showAlert;
    };
  }, []);

  // Hydrate cart from localStorage on first load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to restore cart from storage', e);
    }
  }, []);

  // Persist cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to persist cart', e);
    }
  }, [cart]);

  const handleAdd = item => {
    const price = normalizePrice(item.priceValue ?? item.price);
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, img: item.img || item.imageUrl, price, quantity: prevQty + 1 }
      };
    });
    showAlert(`${item.title || item.name} به سبد خرید اضافه شد`, 'success');
  };

  const handleIncrement = item => {
    const price = normalizePrice(item.priceValue ?? item.price);
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, img: item.img || item.imageUrl, price, quantity: prevQty + 1 }
      };
    });
    showAlert(`تعداد ${item.title || item.name} افزایش یافت`, 'info');
  };

  const handleDecrement = item => {
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      if (prevQty <= 1) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [item.id]: { ...item, quantity: prevQty - 1 }
      };
    });
    showAlert(`تعداد ${item.title || item.name} کاهش یافت`, 'info');
  };

  const handleRemove = item => {
    setCart(prev => {
      const { [item.id]: _, ...rest } = prev;
      return rest;
    });
    showAlert(`${item.title || item.name} از سبد خرید حذف شد`, 'warning');
  };

  const handleClearCart = () => setCart({});

  const handleSearch = text => {
    console.log('search:', text);
  };

  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const clearCart = () => setCart({});
    window.addEventListener('clear-cart', clearCart);
    return () => window.removeEventListener('clear-cart', clearCart);
  }, []);

  return (
    <>
      {!hideNavbar && (
        <Navbar
          cartItems={cartItems}
          onSearch={handleSearch}
        />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home cart={cart} onAdd={handleAdd} onIncrement={handleIncrement} onDecrement={handleDecrement} />} />
          <Route path="/home" element={<Home cart={cart} onAdd={handleAdd} onIncrement={handleIncrement} onDecrement={handleDecrement} />} />
          <Route path="/cart" element={<Cart cart={cart} cartItems={cartItems} onIncrement={handleIncrement} onDecrement={handleDecrement} onRemove={handleRemove} onClearCart={handleClearCart} />} />
          <Route path="/wishlist" element={<Wishlist onAdd={handleAdd} cart={cart} onIncrement={handleIncrement} onDecrement={handleDecrement} />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={hideAlert}
        />
      )}
    </>
  );
}
