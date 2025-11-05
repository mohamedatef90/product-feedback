import React, { useState } from 'react';

interface StarIconProps {
  filled: boolean;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ filled, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="1.5"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <StarIcon
            filled={star <= (hoverRating || rating)}
            className="w-7 h-7 text-yellow-500 transition-colors duration-200"
          />
        </button>
      ))}
    </div>
  );
};

export default RatingInput;