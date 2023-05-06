import React, { useState } from "react";
import RestaurantCard from "./RestaurantCard";
interface RestaurantListProps {
  restaurants: google.maps.places.PlaceResult[];
  currentPosition: google.maps.LatLng | null;
  searchQuery: string;
}

function calculateDistance(
  location1: google.maps.LatLng,
  location2: google.maps.LatLng
): number {
  return window.google.maps.geometry.spherical.computeDistanceBetween(
    location1,
    location2
  );
}

function sortRestaurants(
  restaurants: google.maps.places.PlaceResult[],
  sortOrder: string,
  currentPosition: google.maps.LatLng
): google.maps.places.PlaceResult[] {
  return restaurants.sort((a, b) => {
    switch (sortOrder) {
      case "rating":
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        } else return 0;

      case "proximity":
        if (a.geometry && b.geometry) {
          const distanceA = calculateDistance(
            currentPosition,
            a.geometry.location
          );
          const distanceB = calculateDistance(
            currentPosition,
            b.geometry.location
          );
          return distanceA - distanceB;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  });
}

function RestaurantList({
  restaurants,
  currentPosition,
  searchQuery,
}: RestaurantListProps) {
  const [orderBy, setOrderBy] = useState("rating");

  let filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.types &&
        restaurant.types.some((type) =>
          type.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  if (currentPosition) {
    filteredRestaurants = sortRestaurants(
      filteredRestaurants,
      orderBy,
      currentPosition
    );
  }
  return (
    <div>
      <label htmlFor="orderBy">Order By:</label>
      <select
        id="orderBy"
        value={orderBy}
        onChange={(e) => setOrderBy(e.target.value)}
      >
        <option value="rating">Rating</option>
        <option value="proximity">Proximity</option>
        {/* add other options */}
      </select>
      <div className="row">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.name} className="col-sm-4 mb-3">
            <RestaurantCard
              restaurant={restaurant}
              currentPosition={currentPosition}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default RestaurantList;
