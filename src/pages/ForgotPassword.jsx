// src/pages/ForgotPassword.jsx
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import '../styles/ForgotPassword.css';
import wave from '../assets/wave.png';

import AuthLayout from '../components/AuthLayout';
import LogoHeader from '../components/LogoHeader';

const ForgotPassword = () => {
  const [step, setStep]   = useState('phone'); // 'phone' | 'code'
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate          = useNavigate();
  const inputsRef         = useRef([]);

  const handlePhoneChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
  };

  const handleSendCode = e => {
    e.preventDefault();
    if (!/^09\d{9}$/.test(phone)) {
      setError('شماره همراه معتبر نیست.');
      return;
    }
    setError('');
    setStep('code');
    // TODO: call backend to actually send the code
  };

  const handleCodeChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    e.target.value = val;
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    } else if (!val && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    const code = inputsRef.current.map(i => i.value).join('');
    if (code.length === 6) {
      console.log('کد کامل:', code);
      // TODO: verify code with backend & navigate to reset password
    }
  };

  const handleResendCode = () => {
    // TODO: call backend to resend code
    console.log('Resend code to', phone);
  };

  return (
    <AuthLayout bgImage={wave}>
      <LogoHeader title="MCL" />

      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className="w-100">
          <div className="form-group">
            <input
              type="tel"
              dir="rtl"
              placeholder="شماره همراه"
              value={phone}
              onChange={handlePhoneChange}
              maxLength="11"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="button-group">
            <button className="btn btn-primary w-100">ارسال کد تأیید</button>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => navigate('/login')}
            >
              بازگشت به ورود
            </button>
          </div>
        </form>
      ) : (
        <div className="w-100">
          <p className="text-center code-label">
            کد شش‌رقمی ارسال‌شده به&nbsp;
            <strong>{phone}</strong>
            &nbsp;را وارد کنید
          </p>

          <div className="code-container" dir="ltr">
            {[...Array(6)].map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                className="code-input"
                ref={el => (inputsRef.current[i] = el)}
                onChange={e => handleCodeChange(i, e)}
              />
            ))}
          </div>

          <div className="code-actions" dir="rtl">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep('phone')}
            >
              اصلاح شماره تلفن
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResendCode}
            >
              ارسال مجدد کد
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
