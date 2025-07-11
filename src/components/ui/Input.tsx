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
    metallic-input w-full px-4 py-3 rounded-xl 
    focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
    transition-all duration-300 outline-none font-light
    ${error ? 'border-red-300/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
    ${floating ? 'peer' : ''}
  `;

  const labelClasses = floating
    ? `
      absolute left-4 top-3 text-slate-500 transition-all duration-300 pointer-events-none font-light
      peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600/80
      peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-blue-600/80
    `
    : 'block text-sm font-light text-slate-700 mb-2';

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
        <p className="mt-1 text-sm text-red-600/80 font-light">{error}</p>
      )}
    </div>
  );
};