// src/components/SignUp/SignUp.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../../services/authService'; // سرویس ثبت‌نام
import '../login/Login.css';                // همان تم لاگین

import logo from '../../assets/logo.png';
import wave from '../../assets/wave.png';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [mobile,    setMobile]    = useState('');
  const [password,  setPassword]  = useState('');

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const navigate  = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    // اعتبارسنجی ساده
    if (!firstName || !lastName || !mobile || !password) {
      setError('تمام فیلدها الزامی هستند.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // فراخوانی بک‌اند
      await registerRequest({ firstName, lastName, mobile, password });

      // بعد از ثبت‌نام موفق می‌توانی توکن بگیری یا به لاگین برگردانی
      navigate('/login', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'ثبت‌نام ناموفق بود، لطفاً دوباره امتحان کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* فرم ثبت‌نام */}
      <div className="login-card">
        <div className="logo">
          <img src={logo} alt="لوگو MCL" />
          <h1>MCL</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <input
              type="text"
              placeholder="نام"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              placeholder="شماره همراه"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
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
              {loading ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              بازگشت به ورود
            </button>
          </div>
        </form>
      </div>

      {/* تصویر موج */}
      <div className="wave-holder">
        <img src={wave} alt="پس‌زمینه موج" />
      </div>
    </div>
  );
};

export default SignUp;
