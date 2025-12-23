import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal/20 backdrop-blur-sm animate-fadeIn font-inter">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleIn border border-white/20">
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-teal dark:text-white font-poppins">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;