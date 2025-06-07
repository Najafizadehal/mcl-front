// src/App.jsx (یا src/routes/AppRoutes.jsx)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* صفحات عمومی */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path='/home' element={<Home/>}/>

      {/* صفحه محافظت‌شده: هوم */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* <Home /> */}
          </ProtectedRoute>
        }
      />

      {/* هر مسیر دیگری → ریدایرکت به هوم */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
