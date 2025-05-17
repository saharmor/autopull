import React from 'react';

export const PageHeader = ({ 
  title,
  description,
  className = '',
  ...props 
}) => {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      <h1 className="text-2xl font-bold text-facebook-blue">{title}</h1>
      {description && (
        <p className="mt-2 text-sm">{description}</p>
      )}
    </div>
  );
};
