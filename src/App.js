import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import SignUp from './components/SignUp/SignUp';
import Home from './pages/Home';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';

function App() {
  return (
    <Routes>
      {/* صفحهٔ عمومی */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* صفحهٔ محافظت‌شده */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* هر مسیر ناشناس → ریدایرکت */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
