import React from 'react';

const Logo = ({ 
  width = 'w-64', 
  showSlogan = true, 
  className = '',
  centered = false,
  sloganClass = ''
}) => {

  return (
    <div className={`flex flex-col ${centered ? 'items-center' : 'items-start'} ${className}`}>
      {/* Container da logo */}
      <div className={`${width} overflow-hidden`}>
        <img 
          src="/logo.png" 
          alt="PlanejaDin Logo"
          className="w-full h-auto object-contain drop-shadow-lg"
        />
      </div>
      
      {/* Slogan - MELHORADO para dark mode */}
      {showSlogan && (
        <div className={`w-full mt-3 ${sloganClass}`}>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 italic text-center leading-tight">
            Planeje hoje, tranquilidade amanhã
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;