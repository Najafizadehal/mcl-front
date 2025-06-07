import React from 'react';

const AuthLayout = ({ children, bgImage }) => (
  <div className="login-container">
    <div className="wave-holder">
      {bgImage && <img src={bgImage} alt="پس‌زمینه موج" />}
    </div>
    <div className="login-card">
      {children}
    </div>
  </div>
);

export default AuthLayout;