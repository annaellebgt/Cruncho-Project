import React from "react";
import RestaurantCard from "./RestaurantCard";

interface RestaurantListProps {
  restaurants: google.maps.places.PlaceResult[];
}

function RestaurantList({ restaurants }: RestaurantListProps) {
  return (
    <div className="row">
      {restaurants.map((restaurant) => (
        <div key={restaurant.name} className="cols-sm">
          <RestaurantCard restaurant={restaurant} />
        </div>
      ))}
    </div>
  );
}
export default RestaurantList;
