import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home           from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import Profile from './pages/Profile';
import React, { useState } from 'react';
import Navbar from './components/Navbar';

// صفحه‌هایی که فقط وقتی لاگین نیستید در دسترس‌اند
const PublicOnly = ({ children }) =>
  localStorage.getItem('token') ? <Navigate to="/" replace /> : children;

export default function App() {
  const [cart, setCart] = useState({});
  const location = useLocation();

  const cartItems = Object.values(cart);

  const handleAdd = item => {
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, quantity: prevQty + 1 }
      };
    });
  };
  const handleIncrement = item => {
    setCart(prev => {
      const prevQty = prev[item.id]?.quantity || 0;
      return {
        ...prev,
        [item.id]: { ...item, quantity: prevQty + 1 }
      };
    });
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
  };

  const handleSearch = text => {
    console.log('جست‌وجو:', text);
  };

  // مسیرهایی که نباید نوبار نمایش داده شود
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

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
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* هر مسیر نامشخص → صفحه اصلی */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
