import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <Routes>
      {/* صفحهٔ عمومی */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />

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
