import React, { useEffect, useReducer, useState } from "react";
import { Card, Badge } from "react-bootstrap";

interface restaurantCardProps {
  restaurant: google.maps.places.PlaceResult;
  currentPosition: google.maps.LatLng | null;
}

function RestaurantCard({ restaurant, currentPosition }: restaurantCardProps) {
  type State = {
    distance: number | null;
    urlPhoto: string;
    photoAttribution: string;
  };
  type Action =
    | { type: "SET_DISTANCE"; payload: number }
    | { type: "SET_URL_PHOTO"; payload: string }
    | { type: "SET_PHOTO_ATTRIBUTION"; payload: string };

  const initialState: State = {
    distance: null,
    urlPhoto: "",
    photoAttribution: "",
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_DISTANCE":
        return {
          ...state,
          distance: action.payload,
        };
      case "SET_URL_PHOTO":
        return {
          ...state,
          urlPhoto: action.payload,
        };
      case "SET_PHOTO_ATTRIBUTION":
        return {
          ...state,
          photoAttribution: action.payload,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

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
      dispatch({ type: "SET_DISTANCE", payload: distance });
    }
    let photo = null;
    if (restaurant.photos && restaurant.photos.length > 0) {
      photo = restaurant.photos[0];
      const urlphoto = photo.getUrl({ maxWidth: 350, maxHeight: 250 });
      const photoAttribution = photo.html_attributions[0];
      dispatch({ type: "SET_URL_PHOTO", payload: urlphoto });
      dispatch({ type: "SET_PHOTO_ATTRIBUTION", payload: photoAttribution });
    }
  }, [restaurant.geometry, currentPosition, restaurant.photos]);

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Header>
          <img
            src={
              state.urlPhoto || process.env.PUBLIC_URL + "/assets/default.png"
            }
            alt="Restaurant"
            style={{ maxWidth: 350, maxHeight: 250 }}
          />
        </Card.Header>

        <Card.Title>{restaurant.name}</Card.Title>

        <Card.Text>Rating: {restaurant.rating}</Card.Text>
        <Card.Text>Address : {restaurant.vicinity}</Card.Text>
        <Card.Text>Distance: {state.distance}</Card.Text>

        <Card.Text>
          Icon : <img src={restaurant.icon} alt="..."></img>
        </Card.Text>
        <Card.Text>Url : {restaurant.url}</Card.Text>
        <Card.Text>
          User Rating Total : {restaurant.user_ratings_total}
        </Card.Text>

        {state.photoAttribution && (
          <div dangerouslySetInnerHTML={{ __html: state.photoAttribution }} />
        )}

        <div>
          {restaurant.types?.map((type, index) => (
            <Badge key={index} bg="secondary" className="mx-1">
              {type}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

export default RestaurantCard;
