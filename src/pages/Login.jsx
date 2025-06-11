import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import wave from '../assets/wave.png';

import { login as loginRequest } from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import LogoHeader from '../components/LogoHeader';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      // const { accessToken } = await loginRequest(username, password);
      // localStorage.setItem('token', accessToken);
      const { accessToken, refreshToken, user } = await loginRequest(username, password);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'ورود ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout bgImage={wave}>
      <LogoHeader title="MCL" />
      <form onSubmit={handleSubmit} className="w-100">
        <div className="form-group">
          <input type="text" placeholder="نام کاربری" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="رمز عبور" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <div className="button-group">
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'در حال بررسی…' : 'ورود'}</button>
          <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/register')}>ثبت نام</button>
        </div>
        <p className="forgot-link mt-2" onClick={() => navigate('/forgot-password')}>فراموشی رمز عبور؟</p>
      </form>
    </AuthLayout>
  );
};

export default Login;