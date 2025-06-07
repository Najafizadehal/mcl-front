import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import wave from '../assets/wave.png';

import { register as registerRequest } from '../services/authService';
import AuthLayout from '../components/AuthLayout';
import LogoHeader from '../components/LogoHeader';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwdErr, setPwdErr] = useState(false);
  const navigate = useNavigate();

  const handleMobileChange = e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 11));
  const mismatch = pwdErr || (password && confirm && password !== confirm);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!firstName || !lastName || mobile.length !== 11 || !password || mismatch) {
      setError('لطفاً فیلدها را صحیح پر کنید.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerRequest({ firstName, lastName, mobile, password });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'ثبت‌نام ناموفق بود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout bgImage={wave}>
      <LogoHeader title="ثبت نام" />
      <form onSubmit={handleSubmit} className="w-100">
        <div className="form-group">
          <input type="text" placeholder="نام" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="نام خانوادگی" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="tel" dir="rtl" placeholder="شماره همراه" value={mobile} onChange={handleMobileChange} maxLength="11" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="رمز عبور" value={password} onChange={e => { setPassword(e.target.value); setPwdErr(confirm && e.target.value !== confirm); }} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="تکرار رمز عبور" value={confirm} onChange={e => { setConfirm(e.target.value); setPwdErr(password && e.target.value !== password); }} />
        </div>
        {(error || pwdErr) && <p className="error-msg">{error || 'رمزها مطابقت ندارند.'}</p>}
        <div className="button-group">
          <button type="submit" className="btn btn-primary w-100" disabled={loading || pwdErr}>{loading ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}</button>
          <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/login')}>بازگشت به ورود</button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;