import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'error':
        return 'bg-error';
      case 'facebook':
        return 'bg-facebook-blue';
      default:
        return '';
    }
  };

  return (
    <span 
      className={`badge ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
