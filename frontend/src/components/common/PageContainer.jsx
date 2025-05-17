import React from 'react';

export const PageContainer = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center min-h-screen w-full ${className}`}
      {...props}
    >
      <div className="w-full max-w-6xl px-4 mx-auto">
        {children}
      </div>
    </div>
  );
};
