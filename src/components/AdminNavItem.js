import React from 'react';
import { Link } from 'react-router-dom';

/**
 * کامپوننتی که فقط برای کاربران با نقش ادمین نمایش داده می‌شود
 * @param {Object} props
 * @param {string} props.to - مسیر مقصد
 * @param {React.ReactNode} props.children - محتوای لینک
 * @param {string} [props.className] - کلاس‌های CSS اختیاری
 */
const AdminNavItem = ({ to, children, className = '' }) => {
  const userRole = localStorage.getItem('userRole');
  
  // اگر کاربر ادمین نبود، چیزی رندر نکن
  if (userRole !== 'ADMIN') {
    return null;
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default AdminNavItem; 