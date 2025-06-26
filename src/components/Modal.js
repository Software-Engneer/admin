import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(3px)',
};

const contentStyles = {
  background: 'rgba(255, 255, 255, 0.85)',
  borderRadius: '20px',
  padding: '3rem',
  maxWidth: '85vw',
  width: '100%',
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(15px)',
};

const closeBtnStyles = {
  position: 'absolute',
  top: '1.2rem',
  right: '1.2rem',
  background: 'rgba(255, 255, 255, 0.6)',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
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
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.6)';
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