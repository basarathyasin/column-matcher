import { useEffect } from "react";

export const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <span>{type === 'success' ? '✓' : 'ℹ'}</span>
      <span>{message}</span>
    </div>
  );
};
