import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonProps) => {
  const baseClasses = 'font-bold transition-all duration-200 rounded-xl flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg',
    secondary: 'bg-gray-400 hover:bg-gray-500 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg',
    gradient: 'bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white shadow-lg transform hover:scale-105',
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-lg',
    lg: 'py-4 px-8 text-xl',
  };
  
  const disabledClasses = disabled ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed transform-none' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;