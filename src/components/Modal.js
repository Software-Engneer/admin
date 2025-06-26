import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(2px)',
};

const contentStyles = {
  background: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '16px',
  padding: '2.5rem',
  maxWidth: '90vw',
  width: '100%',
  maxHeight: '85vh',
  overflowY: 'auto',
  position: 'relative',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
};

const closeBtnStyles = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'rgba(255, 255, 255, 0.8)',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={modalStyles} role="dialog" aria-modal="true">
      <div style={contentStyles}>
        <button 
          style={closeBtnStyles} 
          onClick={onClose} 
          aria-label="Close modal"
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.8)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 