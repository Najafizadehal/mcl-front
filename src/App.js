import { Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home           from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard'; 

// صفحه‌ای که فقط برای کاربران خروج‌کرده در دسترس است
const PublicOnly = ({ children }) =>
  localStorage.getItem('token') ? <Navigate to="/" replace /> : children;

export default function App() {
  return (
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

      {/* صفحات محافظت‌شده */}
      <Route element={<ProtectedRoute />}>
        <Route path="/"      element={<Home />} />
        <Route path="/home"  element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* مسیرهای ناشناخته */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
