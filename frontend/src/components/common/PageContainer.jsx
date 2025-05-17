import React from 'react';

export const PageContainer = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-gradient-facebook ${className}`}
      {...props}
    >
      <div className="w-full max-w-4xl px-4">
        {children}
      </div>
    </div>
  );
};
