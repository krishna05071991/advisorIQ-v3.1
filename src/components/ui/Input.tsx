import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  floating?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  floating = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 border-gray-200 rounded-lg 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
    transition-all duration-200 outline-none
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}
    ${floating ? 'peer' : ''}
  `;

  const labelClasses = floating
    ? `
      absolute left-4 top-3 text-gray-500 transition-all duration-200 pointer-events-none
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600
      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600
    `
    : 'block text-sm font-medium text-gray-700 mb-2';

  return (
    <div className={`relative ${className}`}>
      <input
        className={inputClasses}
        placeholder={floating ? ' ' : props.placeholder}
        {...props}
      />
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};