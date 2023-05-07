import React from "react";
import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";
import "./Restaurants.css";

interface StarRatingProps {
  rating: number | undefined;
  user_ratings_total: number | undefined;
}

function StarRating({ rating, user_ratings_total }: StarRatingProps) {
  const totalStars = 5;
  let activeStars = 0;
  let halfStars = 0;
  if (rating) {
    activeStars = rating | 0;
    if ((rating * 10) % 10 >= 5) halfStars = 1;
  }
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center star">
        {[...new Array(totalStars)].map((arr, index) => {
          if (index < activeStars) {
            return <BsStarFill />;
          } else if (index === activeStars && halfStars === 1) {
            return <BsStarHalf />;
          } else {
            return <BsStar />;
          }
        })}
      </div>
      <div className="ms-2">({user_ratings_total})</div>
    </div>
  );
}

export default StarRating;
