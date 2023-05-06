import React from "react";
import RestaurantCard from "./RestaurantCard";
interface RestaurantListProps {
  restaurants: google.maps.places.PlaceResult[];
  currentPosition: google.maps.LatLng | null;
  searchQuery: string;
}

function RestaurantList({
  restaurants,
  currentPosition,
  searchQuery,
}: RestaurantListProps) {
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="row">
      {filteredRestaurants.map((restaurant) => (
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
