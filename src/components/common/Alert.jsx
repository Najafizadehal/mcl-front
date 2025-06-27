import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ 
  message, 
  type = 'success', 
  duration = 4000, 
  onClose, 
  show = true,
  confirm = false,
  onConfirm,
  onCancel,
  confirmText = 'تایید',
  cancelText = 'انصراف'
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0 && !confirm) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, confirm]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleConfirm = () => {
    setIsVisible(false);
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    setIsVisible(false);
    onCancel?.();
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
        {confirm ? (
          <div className="alert-actions">
            <button className="alert-btn confirm" onClick={handleConfirm}>{confirmText}</button>
            <button className="alert-btn cancel" onClick={handleCancel}>{cancelText}</button>
          </div>
        ) : (
          <button className="alert-close" onClick={handleClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  show: PropTypes.bool,
  duration: PropTypes.number,
  confirm: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string
};

export default Alert; 