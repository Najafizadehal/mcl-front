import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home           from './pages/Home';
import Cart           from './pages/Cart';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Alert from './components/common/Alert';

// صفحه‌هایی که فقط وقتی لاگین نیستید در دسترس‌اند
const PublicOnly = ({ children }) =>
  localStorage.getItem('token') ? <Navigate to="/" replace /> : children;

export default function App() {
  const [cart, setCart] = useState({});
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  const cartItems = Object.values(cart);

  // سیستم نمایش پیام‌ها
  const showAlert = (message, type = 'success', duration = 4000) => {
    setAlert({ message, type, duration });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  // در دسترس قرار دادن showAlert در سراسر برنامه
  useEffect(() => {
    window.showAlert = showAlert;
    return () => {
      delete window.showAlert;
    };
  }, []);

  const handleAdd = item => {
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, quantity: prevQty + 1 }
      };
    });
    showAlert(`${item.title || item.name} به سبد خرید اضافه شد`, 'success');
  };
  const handleIncrement = item => {
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, quantity: prevQty + 1 }
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

  const handleClearCart = () => {
    setCart({});
  };

  const handleSearch = text => {
    console.log('جست‌وجو:', text);
  };

  // مسیرهایی که نباید نوبار نمایش داده شود
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  // پاک کردن سبد خرید بعد از ثبت سفارش
  useEffect(() => {
    const clearCart = () => {
      setCart({});
    };
    window.addEventListener('clear-cart', clearCart);
    return () => window.removeEventListener('clear-cart', clearCart);
  }, []);

  return (
    <>
      {!hideNavbar && (
        <Navbar
          cart={cart}
          cartItems={cartItems}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onSearch={handleSearch}
        />
      )}
      <Routes>
        {/* صفحات عمومی */}
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

        {/* مسیرهای محافظت‌شده */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home cart={cart} onAdd={handleAdd} onIncrement={handleIncrement} onDecrement={handleDecrement} />} />
          <Route path="/home" element={<Home cart={cart} onAdd={handleAdd} onIncrement={handleIncrement} onDecrement={handleDecrement} />} />
          <Route path="/cart" element={<Cart cart={cart} cartItems={cartItems} onIncrement={handleIncrement} onDecrement={handleDecrement} onRemove={handleRemove} onClearCart={handleClearCart} />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* هر مسیر نامشخص → صفحه اصلی */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* نمایش پیام‌ها */}
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
