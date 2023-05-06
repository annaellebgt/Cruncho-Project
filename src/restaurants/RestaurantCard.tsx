import React, { useEffect, useState } from "react";

interface restaurantCardProps {
  restaurant: google.maps.places.PlaceResult;
  currentPosition: google.maps.LatLng | null;
}

function RestaurantCard({ restaurant, currentPosition }: restaurantCardProps) {
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (restaurant.geometry && currentPosition) {
      const placeLocation = new window.google.maps.LatLng(
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
      );

      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          currentPosition,
          placeLocation
        );
      setDistance(distance);
    }
  }, [restaurant.geometry, currentPosition]);
  return (
    <div className="card">
      Test
      <section className="section dark">
        <h5 className="strong">
          <strong>{restaurant.name}</strong>
        </h5>
        <p>Rating : {restaurant.rating}</p>
        <p>Types : {restaurant.types?.concat(", ")}</p>
        <p>Distance : {distance}</p>
      </section>
    </div>
  );
}

export default RestaurantCard;
