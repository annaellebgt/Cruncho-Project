import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";
import { FaWalking, FaMapMarkedAlt } from "react-icons/fa";
import { FcHome } from "react-icons/fc";

interface restaurantModalProps {
  restaurant: google.maps.places.PlaceResult;
  currentPosition: google.maps.LatLng | null;
  distance: number | null;
  urlPhoto: string;
  photoAttribution: string;
  handleCloseModal: () => void;
}

function RestaurantModal({
  restaurant,
  currentPosition,
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
            className="rounded-start"
            alt="Restaurant"
            style={{ height: "100%", objectFit: "cover" }}
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

            <div className="row mb-3">
              <div className="col">
                <StarRating
                  rating={restaurant.rating}
                  user_ratings_total={restaurant.user_ratings_total}
                ></StarRating>
              </div>
              <div className="col justify-content-end d-flex align-items-center">
                <FaWalking></FaWalking>
                <span className="ms-2">{distance} m</span>
              </div>
            </div>
            <div className="my-2">
              <div className="d-flex align-items-center">
                <FcHome></FcHome>
                <span className="ms-2">{restaurant.vicinity}</span>
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
