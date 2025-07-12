import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= rating;

    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled 
            ? 'text-yellow-500 fill-yellow-500' 
            : 'text-gray-300'
        } ${className}`}
      />
    );
  });

  return (
    <div className="flex items-center space-x-0.5">
      {stars}
    </div>
  );
};