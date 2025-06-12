import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * فقط زمانی رندر می‌کند که کاربر لاگین کرده و نقش ادمین داشته باشد.
 * در غیر این صورت، به صفحهٔ لاگین یا داشبورد کاربر عادی هدایت می‌کند.
 */
const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();

  if (!token) {
    // اگر توکن وجود نداشت، به صفحه لاگین هدایت کن
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (userRole !== 'ADMIN') {
    // اگر کاربر ادمین نبود، به داشبورد کاربر عادی هدایت کن
    return <Navigate to="/dashboard" replace />;
  }

  // اگر کاربر ادمین بود، اجازه دسترسی بده
  return <Outlet />;
};

export default AdminRoute; 