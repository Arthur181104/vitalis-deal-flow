
import React from 'react';
import { CompanyRating, getRatingColor } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: CompanyRating | undefined;
  className?: string;
}

const RatingBadge = ({ rating, className }: RatingBadgeProps) => {
  if (!rating || rating === 'Not Rated') {
    return (
      <span className={cn("px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", className)}>
        Not Rated
      </span>
    );
  }

  return (
    <span className={cn("px-2 py-1 rounded text-xs font-medium", getRatingColor(rating), className)}>
      {rating}
    </span>
  );
};

export default RatingBadge;
