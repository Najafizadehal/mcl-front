import React from 'react';
import logo from '../../assets/logo.png';

const LogoHeader = ({ title = 'MCL' }) => (
  <div className="logo">
    <img src={logo} alt="لوگو MCL" />
    <h1>{title}</h1>
  </div>
);

export default LogoHeader;