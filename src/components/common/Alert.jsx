import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose, 
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">
          {type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
        </span>
        <span className="alert-message">{message}</span>
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  show: PropTypes.bool,
  duration: PropTypes.number
};

export default Alert; 