import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`glass-card rounded-xl ${className}`}>
      {children}
    </div>
  );
};