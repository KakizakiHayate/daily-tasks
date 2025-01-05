import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trash2, AlertCircle } from 'lucide-react';

const toastStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={20} />;
    case 'error':
      return <AlertCircle size={20} />;
    case 'delete':
      return <Trash2 size={20} />;
    default:
      return <CheckCircle size={20} />;
  }
};

export const Toast = ({ message, isVisible, onClose, type = 'success' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed top-4 right-4 flex items-center space-x-2 ${toastStyles[type]} text-white px-6 py-4 rounded-lg shadow-lg`}
          style={{ zIndex: 50 }}
        >
          <ToastIcon type={type} />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 