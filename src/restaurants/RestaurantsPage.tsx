import React, { useState, useEffect } from "react";
import RestaurantList from "./RestaurantList";

declare global {
  interface Window {
    google: any;
  }
}

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Call the Google Places API to get the nearby restaurants
      const request = {
        location: { lat: latitude, lng: longitude },
        radius: 500,
        type: ["restaurant"],
      };
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.nearbySearch(request, (results: any, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setRestaurants(results);
          console.log(results);
        }
      });
    });
  }, []);
  return (
    <div>
      <h1>Nearby Restaurants</h1>
      <RestaurantList restaurants={restaurants} />
    </div>
  );
}

export default RestaurantsPage;
