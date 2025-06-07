import React from 'react';

const Navbar = ({ onSearch }) => (
  <header className="navbar">
    <div className="navbar-brand-menu">
      <h1 className="brand">Mobile Center Lamerd</h1>
      <button className="menu-btn" aria-label="Menu">☰</button>
    </div>
    <input
      className="search"
      type="text"
      placeholder="جست‎وجو کنید"
      onChange={e => onSearch?.(e.target.value)}
    />
  </header>
);

export default Navbar;