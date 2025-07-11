import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = true
}) => {
  const baseClasses = 'rounded-2xl overflow-hidden transition-all duration-300 floating-element';
  const cardClasses = gradient 
    ? 'card-metallic' 
    : 'chrome-reflection border border-white/30';
  
  const hoverClasses = hover ? 'hover:shadow-2xl' : '';

  return (
    <div className={`${baseClasses} ${cardClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};