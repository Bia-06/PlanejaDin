import React from 'react';

const Logo = ({ 
  width = 'w-48',
  showSlogan = true, 
  className = '',
  centered = false,
  sloganClass = ''
}) => {

  return (
    <div className={`flex flex-col ${centered ? 'items-center' : 'items-start'} ${className}`}>
      <div className={`${width} overflow-hidden transition-all duration-300`}>
        
        <img 
          src="/logo.png" 
          alt="PlanejaDin Logo"
          className="w-full h-auto object-contain drop-shadow-lg block dark:hidden"
        />

        <img 
          src="/logo-dark.png" 
          alt="PlanejaDin Logo Dark"
          className="w-full h-auto object-contain drop-shadow-lg hidden dark:block"
        />

      </div>
      
      {showSlogan && (
        <div className={`w-full mt-2 ${sloganClass}`}> 
          <p className="font-inter text-xs text-gray-600 dark:text-gray-300 italic text-center leading-tight">
            A forma inteligente de cuidar do seu dinheiro
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;