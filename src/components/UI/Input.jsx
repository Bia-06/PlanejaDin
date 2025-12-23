import React from 'react';

const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  name, 
  min, 
  max, 
  disabled,
  className = "", // NOVO: aceita classes adicionais
  style = {} // NOVO: aceita estilos inline
}) => (
  <div className="mb-4 font-inter">
    <label className="block text-sm font-semibold text-teal dark:text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-teal dark:text-white focus:ring-2 focus:ring-mint focus:border-transparent outline-none transition-all placeholder-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''} ${className}`}
      style={style}
    />
  </div>
);

export default Input;