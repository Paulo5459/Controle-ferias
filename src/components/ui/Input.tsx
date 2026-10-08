import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[#111827] border ${
          error ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-[#263244] focus:border-[#2563EB] focus:ring-[#2563EB]'
        } rounded-lg px-3.5 py-2 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-1 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#64748B] mt-1">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string | number; label: string }[];
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  children,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-[#94A3B8] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[#111827] border ${
          error ? 'border-[#EF4444] focus:ring-[#EF4444]' : 'border-[#263244] focus:border-[#2563EB] focus:ring-[#2563EB]'
        } rounded-lg px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-1 transition-colors cursor-pointer ${className}`}
        {...props}
      >
        {options
          ? options.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-[#111827] text-[#F8FAFC]">
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#64748B] mt-1">{helperText}</p>}
    </div>
  );
};
