// components/StockLogo.jsx
import React from 'react';

const StockLogo = ({ code, className = "" }) => {
  const firstLetter = code.charAt(0).toUpperCase();
  
  return (
    <div 
      className={`${className} flex items-center justify-center bg-[#05369D] text-white font-bold`}
    >
      {firstLetter}
    </div>
  );
};

export default StockLogo;