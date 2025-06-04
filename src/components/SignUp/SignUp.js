// src/components/SignUp/SignUp.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../../services/authService';
import '../login/Login.css';             

import logo from '../../assets/logo.png';
import wave from '../../assets/wave.png';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [mobile,    setMobile]    = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [pwdErr,  setPwdErr]  = useState(false);   // خطای عدم تطابق رمز

  const navigate = useNavigate();

  /* کمکى: تطابق رمز و تکرار */
  const passwordsMismatch = (pwd, conf) => pwd && conf && pwd !== conf;

  /* محدودکردن ورودی تلفن به فقط عدد و حداکثر ۱۰ رقم */
  const handleMobileChange = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 11);
    setMobile(onlyDigits);
  };

  const handlePasswordChange = e => {
    const value = e.target.value;
    setPassword(value);
    setPwdErr(passwordsMismatch(value, confirm));
  };

  const handleConfirmChange = e => {
    const value = e.target.value;
    setConfirm(value);
    setPwdErr(passwordsMismatch(password, value));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!firstName || !lastName || !mobile || !password || !confirm) {
      setError('تمام فیلدها الزامی هستند.');
      return;
    }
    if (mobile.length !== 11) {
      setError('شماره همراه باید دقیقاً ۱۰ رقم باشد.');
      return;
    }
    if (passwordsMismatch(password, confirm)) {
      setError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerRequest({ firstName, lastName, mobile, password });
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
              dir="rtl"
              style={{ textAlign: 'right' }}
              placeholder="شماره همراه"
              value={mobile}
              onChange={handleMobileChange}
              maxLength="11"
              inputMode="numeric"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="تکرار رمز عبور"
              value={confirm}
              onChange={handleConfirmChange}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
          {pwdErr && !error && (
            <p className="error-msg">رمز عبور و تکرار آن مطابقت ندارند.</p>
          )}

          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || pwdErr}
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

      <div className="wave-holder">
        <img src={wave} alt="پس‌زمینه موج" />
      </div>
    </div>
  );
};

export default SignUp;
