import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../services/authService';   // ← مسیر درست
import './Login.css';

import logo from '../../assets/logo.png';
import wave from '../../assets/wave.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!username || !password) {
      setError('نام کاربری و رمز عبور الزامی است.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // درخواست به بک‌اند
      const { accessToken } = await loginRequest(username, password);

      // توکن را نگه می‌داریم (برای نمونه در localStorage)
      localStorage.setItem('token', accessToken);

      // هدایت به داشبورد
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'ورود ناموفق بود، لطفاً دوباره امتحان کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* فرم لاگین */}
      <div className="login-card">
        <div className="logo">
          <img src={logo} alt="لوگو MCL" />
          <h1>MCL</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <input
              type="text"
              placeholder="نام کاربری"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'در حال بررسی…' : 'ورود'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              ثبت نام
            </button>
          </div>

          {/* لینک فراموشی رمز عبور */}
          <p className="forgot-link" onClick={() => navigate('/forgot-password')}>
            رمز عبور خود را فراموش کرده‌اید؟
          </p>
          
        </form>
      </div>

      {/* تصویر موج */}
      <div className="wave-holder">
        <img src={wave} alt="پس‌زمینه موج" />
      </div>
    </div>
  );
};

export default Login;
