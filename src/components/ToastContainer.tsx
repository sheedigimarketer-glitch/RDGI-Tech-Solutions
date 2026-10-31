import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          <span>{toast.type === 'error' ? '⚠️' : toast.type === 'warning' ? '⚡' : '✨'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
