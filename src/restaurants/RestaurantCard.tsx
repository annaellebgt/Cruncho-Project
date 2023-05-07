import React, { useEffect, useReducer, useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";
import RestaurantModal from "./RestaurantModal";
import StarRating from "./StarRating";
import { FaWalking } from "react-icons/fa";
import "./Restaurants.css";

interface restaurantCardProps {
  restaurant: google.maps.places.PlaceResult;
  currentPosition: google.maps.LatLng | null;
}

function RestaurantCard({ restaurant, currentPosition }: restaurantCardProps) {
  type State = {
    distance: number | null;
    urlPhoto: string;
    photoAttribution: string;
    showModal: boolean;
  };
  type Action =
    | { type: "SET_DISTANCE"; payload: number }
    | { type: "SET_URL_PHOTO"; payload: string }
    | { type: "SET_PHOTO_ATTRIBUTION"; payload: string }
    | { type: "SET_SHOW_MODAL"; payload: boolean };

  const initialState: State = {
    distance: null,
    urlPhoto: "",
    photoAttribution: "",
    showModal: false,
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
      case "SET_SHOW_MODAL":
        return {
          ...state,
          showModal: action.payload,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleCloseModal = () => {
    dispatch({ type: "SET_SHOW_MODAL", payload: false });
  };

  const handleOpenModal = () => {
    dispatch({ type: "SET_SHOW_MODAL", payload: true });
  };

  useEffect(() => {
    if (restaurant.geometry && currentPosition) {
      const placeLocation = new window.google.maps.LatLng(
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
      );

      let distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          currentPosition,
          placeLocation
        );
      distance = Math.ceil(distance);
      dispatch({ type: "SET_DISTANCE", payload: distance });
    }
    let photo = null;
    if (restaurant.photos && restaurant.photos.length > 0) {
      photo = restaurant.photos[0];
      const urlphoto = photo.getUrl({ maxWidth: 250, maxHeight: 200 });
      const photoAttribution = photo.html_attributions[0].replace(
        />([^<]+)<\/a>/,
        ">Get more information</a>"
      );

      dispatch({ type: "SET_URL_PHOTO", payload: urlphoto });
      dispatch({ type: "SET_PHOTO_ATTRIBUTION", payload: photoAttribution });
    }
  }, [restaurant.geometry, currentPosition, restaurant.photos]);

  return (
    <>
      <Card className="restaurant-card" onClick={handleOpenModal}>
        <Card.Body>
          <Card.Header
            className="mx-auto"
            style={{ width: 260, height: 225, position: "relative" }}
          >
            <img
              src={
                state.urlPhoto || process.env.PUBLIC_URL + "/assets/default.png"
              }
              alt="Restaurant"
              className="restaurant-img-header"
            />
          </Card.Header>
          <Card.Title className="mt-2">
            <div className="d-flex align-items-center">
              <img
                src={restaurant.icon}
                alt="..."
                style={{ width: 15, height: 20, position: "relative" }}
              ></img>
              <span className="ms-2 restaurant-title-card">
                {restaurant.name}
              </span>
            </div>
          </Card.Title>

          <div className="row">
            <div className="col">
              <StarRating
                rating={restaurant.rating}
                user_ratings_total={restaurant.user_ratings_total}
              ></StarRating>
            </div>
            <div className="col justify-content-end d-flex align-items-center">
              <FaWalking></FaWalking>
              <span className="ms-2">{state.distance} m</span>
            </div>
          </div>
        </Card.Body>
      </Card>
      {state.showModal && (
        <Modal
          size="lg"
          centered
          show={state.showModal}
          onHide={handleCloseModal}
        >
          <Modal.Body>
            <RestaurantModal
              restaurant={restaurant}
              distance={state.distance}
              urlPhoto={state.urlPhoto}
              photoAttribution={state.photoAttribution}
              handleCloseModal={handleCloseModal}
            ></RestaurantModal>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default RestaurantCard;
