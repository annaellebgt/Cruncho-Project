import React, { useEffect, useReducer, useState } from "react";
import { Card, Badge, Modal, Button } from "react-bootstrap";
import RestaurantModal from "./RestaurantModal";
import StarRating from "./StarRating";
import { FaWalking } from "react-icons/fa";

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
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
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
      <Card
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      >
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </Card.Header>
          <Card.Title className="mt-2">
            <div className="d-flex align-items-center">
              <img
                src={restaurant.icon}
                alt="..."
                style={{ width: 15, height: 20, position: "relative" }}
              ></img>
              <span
                className="ms-2"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "250px",
                }}
              >
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
      {showModal && (
        <Modal
          size="lg"
          centered
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Body>
            <RestaurantModal
              restaurant={restaurant}
              currentPosition={currentPosition}
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
