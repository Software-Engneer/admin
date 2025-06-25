import React from 'react';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const contentStyles = {
  background: '#fff',
  borderRadius: '10px',
  padding: '2rem',
  maxWidth: '95vw',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
};

const closeBtnStyles = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div style={modalStyles} role="dialog" aria-modal="true">
      <div style={contentStyles}>
        <button style={closeBtnStyles} onClick={onClose} aria-label="Close modal">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 