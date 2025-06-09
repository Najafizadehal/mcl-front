import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * مسیرهای داخل این Route فقط زمانی نمایش داده می‌شوند
 * که کلاینت در localStorage توکن داشته باشد.
 */
const ProtectedRoute = () => {
  const token     = localStorage.getItem('token');
  const location  = useLocation();

  return token
    ? <Outlet />                       // ادامهٔ روت‌های تو در تو
    : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
