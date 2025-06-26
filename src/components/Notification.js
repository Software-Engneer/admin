import React, { useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};

export default Notification; 