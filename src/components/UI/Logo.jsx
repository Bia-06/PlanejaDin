import React from 'react';

const Logo = ({ 
  width = 'w-48', // ALTERADO: Reduzido de w-64 para w-48
  showSlogan = true, 
  className = '',
  centered = false,
  sloganClass = ''
}) => {

  return (
    <div className={`flex flex-col ${centered ? 'items-center' : 'items-start'} ${className}`}>
      {/* Container da logo */}
      <div className={`${width} overflow-hidden transition-all duration-300`}>
        
        {/* LOGO PARA MODO CLARO (Texto Escuro) */}
        <img 
          src="/logo.png" 
          alt="PlanejaDin Logo"
          className="w-full h-auto object-contain drop-shadow-lg block dark:hidden"
        />

        {/* LOGO PARA MODO ESCURO (Texto Claro) */}
        <img 
          src="/logo-dark.png" 
          alt="PlanejaDin Logo Dark"
          className="w-full h-auto object-contain drop-shadow-lg hidden dark:block"
        />

      </div>
      
      {/* Slogan */}
      {showSlogan && (
        <div className={`w-full mt-2 ${sloganClass}`}> {/* mt-3 mudado para mt-2 para ficar mais perto */}
          <p className="font-inter text-xs text-gray-600 dark:text-gray-300 italic text-center leading-tight"> {/* text-sm mudado para text-xs */}
            A forma inteligente de cuidar do seu dinheiro
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;