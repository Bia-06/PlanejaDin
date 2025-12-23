import React from 'react';
import { ChevronRight } from 'lucide-react';

const Select = ({ label, value, onChange, options, name }) => (
  <div className="mb-4 font-inter">
    <label className="block text-sm font-semibold text-teal dark:text-gray-300 mb-2">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-teal dark:text-white focus:ring-2 focus:ring-mint outline-none transition-all appearance-none"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-teal">
        <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
    </div>
  </div>
);

export default Select;