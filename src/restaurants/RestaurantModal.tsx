import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";
import { FaWalking, FaMapMarkedAlt } from "react-icons/fa";
import { FcHome } from "react-icons/fc";
import "./Restaurants.css";

interface restaurantModalProps {
  restaurant: google.maps.places.PlaceResult;
  distance: number | null;
  urlPhoto: string;
  photoAttribution: string;
  handleCloseModal: () => void;
}

function RestaurantModal({
  restaurant,
  distance,
  urlPhoto,
  photoAttribution,
  handleCloseModal,
}: restaurantModalProps) {
  return (
    <Card style={{ border: 0 }}>
      <Row className="g-0">
        <Col md={4}>
          <Card.Img
            variant="top"
            src={urlPhoto || process.env.PUBLIC_URL + "/assets/default.png"}
            className="rounded-start restaurant-img-modal"
            alt="Restaurant"
          />
        </Col>

        <Col md={8}>
          <div className="d-flex justify-content-end">
            <button className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <Card.Body>
            <Card.Title>
              <div className="d-flex align-items-center">
                <img
                  src={restaurant.icon}
                  alt="..."
                  style={{ width: 15, height: 20, position: "relative" }}
                ></img>
                <span className="ms-2">{restaurant.name}</span>
              </div>
            </Card.Title>
            <div className="mb-3">
              <StarRating
                rating={restaurant.rating}
                user_ratings_total={restaurant.user_ratings_total}
              ></StarRating>
            </div>
            <div className="my-2">
              <div className="d-flex align-items-center">
                <FcHome></FcHome>
                <span className="ms-2">{restaurant.vicinity}</span>
              </div>
              <div className="d-flex align-items-center">
                <FaWalking></FaWalking>
                <span className="ms-2">{distance} m</span>
              </div>
              <div className="d-flex align-items-center">
                <FaMapMarkedAlt className="me-2" />
                {photoAttribution && (
                  <div dangerouslySetInnerHTML={{ __html: photoAttribution }} />
                )}
              </div>
            </div>
            <div className="mt-3">
              {restaurant.types?.map((type, index) => (
                <Badge key={index} bg="primary" className="mx-1">
                  {type}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default RestaurantModal;
