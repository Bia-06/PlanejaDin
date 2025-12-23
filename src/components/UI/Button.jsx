import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-sm";
  
  const variants = {
    primary: "bg-mint hover:bg-[#00b57a] text-white shadow-mint/30 shadow-lg",
    secondary: "bg-white text-teal border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-100 text-red-600 hover:bg-red-200",
    ghost: "text-teal hover:bg-gray-100 dark:hover:bg-gray-800",
    outline: "border-2 border-mint text-mint hover:bg-mint/10"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;