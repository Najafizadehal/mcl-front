import React from 'react';
import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose, show = true }) => {
  if (!show) return null;

  const alertIcon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass}>
      <div className="alert-content">
        <span className="alert-icon">{alertIcon[type]}</span>
        <span className="alert-message">{message}</span>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  show: PropTypes.bool
};

export default Alert; 