import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * فقط زمانی رندر می‌کند که توکن در localStorage وجود داشته باشد.
 * در غیر این صورت، به صفحهٔ لاگین هدایت می‌کند.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  return token
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
