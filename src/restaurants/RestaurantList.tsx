import React from "react";
import RestaurantCard from "./RestaurantCard";
interface RestaurantListProps {
  restaurants: google.maps.places.PlaceResult[];
  currentPosition: google.maps.LatLng | null;
}

function RestaurantList({ restaurants, currentPosition }: RestaurantListProps) {
  return (
    <div className="row">
      {restaurants.map((restaurant) => (
        <div key={restaurant.name} className="cols-sm">
          <RestaurantCard
            restaurant={restaurant}
            currentPosition={currentPosition}
          />
        </div>
      ))}
    </div>
  );
}
export default RestaurantList;
