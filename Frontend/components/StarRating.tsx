import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = 20,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    if (readOnly || !onRatingChange) return;
    setHoverRating(index + 1);
  };

  const handleClick = () => {
    if (readOnly || !onRatingChange || hoverRating === null) return;
    onRatingChange(hoverRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div
      className="flex items-center space-x-1"
      onMouseLeave={handleMouseLeave}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const value = index + 1;
        const isFull = displayRating >= value;

        return (
          <div
            key={index}
            className={`relative ${readOnly ? "" : "cursor-pointer"}`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            <Star
              size={size}
              className={
                isFull ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
