import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'premium' | 'floating';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'glass' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-card rounded-2xl';
      case 'premium':
        return 'premium-gradient rounded-2xl shadow-2xl border border-white/30';
      case 'floating':
        return 'glass-card rounded-2xl floating-element';
      default:
        return 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20';
    }
  };

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {children}
    </div>
  );
};