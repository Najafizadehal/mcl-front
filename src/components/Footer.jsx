import React from 'react';

const Footer = () => (
  <footer className="footer">
    <svg className="footer-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        d="M0 0 L48 10.7 C96 21 192 43 288 64 C384 85 480 107 576 138.7 C672 171 768 213 864 197.3 C960 181 1056 107 1152 90.7 C1248 75 1344 117 1392 138.7 L1440 160 V0 H0 Z"
        fill="#ffffff"
      />
    </svg>
    <div className="footer-inner">
      <p>موبایل سنتر لامرد</p>
      <p>تلفن: 7659 5272 071</p>
      <p>ایمیل: info@example.com</p>
      <p>آدرس:  فارس - لامرد - خیابان 22 بهمن - روبروی پاساژ نخل جنوب</p>
    </div>
  </footer>
);

export default Footer;