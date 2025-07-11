import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  gradient = false 
}) => {
  const baseClasses = 'rounded-xl shadow-lg border border-gray-100 overflow-hidden';
  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-white to-gray-50' 
    : 'bg-white';

  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};