import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1220] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-10',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
  };

  const variantStyles = {
    primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white focus:ring-[#2563EB] shadow-sm active:scale-[0.99]',
    secondary: 'bg-[#1F2937] hover:bg-[#374151] text-[#F8FAFC] border border-[#263244] focus:ring-[#14B8A6]',
    outline: 'bg-transparent border border-[#263244] hover:bg-[#111827] text-[#F8FAFC] hover:border-slate-500 focus:ring-slate-400',
    ghost: 'bg-transparent hover:bg-[#1F2937]/70 text-[#94A3B8] hover:text-[#F8FAFC]',
    danger: 'bg-[#EF4444]/15 border border-[#EF4444]/30 hover:bg-[#EF4444]/25 text-[#EF4444] focus:ring-[#EF4444]',
    accent: 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:opacity-95 text-white shadow-sm font-semibold active:scale-[0.99]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
