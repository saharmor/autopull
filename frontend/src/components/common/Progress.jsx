import React from 'react';

export const Progress = ({ 
  value = 0, 
  max = 100, 
  className = '',
  variant = 'primary',
  ...props 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getVariantClass = () => {
    switch (variant) {
      case 'success':
        return 'bg-success';
      case 'facebook':
        return 'bg-facebook-blue';
      default:
        return 'bg-facebook-blue'; // Default to facebook blue
    }
  };

  return (
    <div className={`progress-container ${className}`} {...props}>
      <div 
        className={`progress-bar ${getVariantClass()}`} 
        style={{ width: `${percentage}%` }}
        role="progressbar" 
        aria-valuenow={value} 
        aria-valuemin="0" 
        aria-valuemax={max}
      />
    </div>
  );
};
