import React from 'react';

export const Input = ({
  className = '',
  type = 'text',
  ...props
}) => {
  return (
    <input
      type={type}
      className={`input ${className}`}
      {...props}
    />
  );
};
