import React from "react";

interface restaurantCardProps {
  restaurant: google.maps.places.PlaceResult;
}

function RestaurantCard(props: restaurantCardProps) {
  const { restaurant } = props;
  return (
    <div className="card">
      Test
      <section className="section dark">
        <h5 className="strong">
          <strong>{restaurant.name}</strong>
        </h5>
        <p>Rating : {restaurant.rating}</p>
        <p>Types : {restaurant.types?.concat(", ")}</p>
      </section>
    </div>
  );
}

export default RestaurantCard;
