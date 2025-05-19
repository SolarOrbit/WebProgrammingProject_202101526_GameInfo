// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-all duration-150 ease-in-out";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-dark focus:ring-brand-primary",
    secondary: "bg-brand-secondary text-white hover:bg-brand-secondary-dark focus:ring-brand-secondary",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outlinePrimary: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary",
    ghost: "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:ring-brand-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;