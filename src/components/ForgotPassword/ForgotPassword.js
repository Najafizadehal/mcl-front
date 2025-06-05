import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login/Login.css';          // همان تم دکمه و فرم
import './ForgotPassword.css';       // استایل‌های اختصاصی این صفحه

import logo from '../../assets/logo.png';
import wave from '../../assets/wave.png';

const ForgotPassword = () => {
  const [step, setStep]     = useState('phone'); // phone | code
  const [phone, setPhone]   = useState('');
  const [error, setError]   = useState('');
  const navigate = useNavigate();

  // آرایه‌ای از refs برای کنترل فوکوس خودکار روی کد
  const inputsRef = useRef([]);

  /* فقط ارقام مجاز و حداکثر 11 رقم (09xxxxxxxxx) */
  const handlePhoneChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(digits);
  };

  /* ارسال شماره؛ اینجا می‌توانی API کال بکنی */
  const handleSendCode = e => {
    e.preventDefault();
    if (phone.length !== 11 || !/^09\d{9}$/.test(phone)) {
      setError('شماره همراه معتبر نیست.');
      return;
    }
    setError('');
    setStep('code');
    // TODO: فراخوانی بک‌اند برای ارسال SMS
  };

  /* جمع‌کردن کد 6رقمی پس از درج */
  const handleCodeChange = (idx, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    e.target.value = val; // تک کاراکتر

    if (val && idx < 5) inputsRef.current[idx + 1]?.focus(); // فوکوس بعدی
    if (!val && idx > 0) inputsRef.current[idx - 1]?.focus(); // برگشت

    // وقتی همه پُر شد:
    const code = inputsRef.current.map(i => i.value).join('');
    if (code.length === 6) {
      console.log('کد کامل:', code);
      // TODO: ارسال به سرور و هدایت به صفحه ریست پسورد
    }
  };

  return (
    <div className="login-container">
      {/* فرم */}
      <div className="login-card">
        <div className="logo">
          <img src={logo} alt="لوگو MCL" />
          <h1>MCL</h1>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendCode} style={{ width: '100%' }}>
            <div className="form-group">
              <input
                type="tel"
                dir="rtl"
                style={{ textAlign: 'right' }}
                placeholder="شماره همراه"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="11"
                inputMode="numeric"
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <div className="button-group">
              <button className="btn btn-primary w-100">
                ارسال کد تأیید
              </button>
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => navigate('/login')}
              >
                بازگشت به ورود
              </button>
            </div>
          </form>
        )}

        {step === 'code' && (
          <div style={{ width: '100%' }}>
            <p className="text-center mb-3">
              کد شش‌رقمی ارسال‌شده به&nbsp;
              <strong>{phone}</strong>
              &nbsp;را وارد کنید
            </p>

            {/* جهت LTR برای چیدمان چپ به راست */}
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

            <div className="button-group code-container d-flex flex-column align-items-center gap-2 mt-2" dir="rtl">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={() => setStep('phone')}
              >
                اصلاح شماره تلفن
              </button>
              {error && <p className="error-msg mb-0">{error}</p>}
            </div>
          </div>
        )}
      </div>

      {/* موج یا تصویر پس‌زمینه؛ اگر نمی‌خواهی حذف کن */}
      <div className="wave-holder">
        <img src={wave} alt="پس‌زمینه موج" />
      </div>
    </div>
  );
};

export default ForgotPassword;
