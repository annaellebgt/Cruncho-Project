import React from "react";
import { Badge, Card, Col, Row } from "react-bootstrap";
import StarRating from "./StarRating";
import { FaWalking } from "react-icons/fa";

interface restaurantModalProps {
  restaurant: google.maps.places.PlaceResult;
  currentPosition: google.maps.LatLng | null;
  distance: number | null;
  urlPhoto: string;
  photoAttribution: string;
}

function RestaurantModal({
  restaurant,
  currentPosition,
  distance,
  urlPhoto,
  photoAttribution,
}: restaurantModalProps) {
  console.log(photoAttribution);
  return (
    <Card style={{ maxWidth: "800px", border: 0 }}>
      <Row className="g-0">
        <Col md={4}>
          <Card.Img
            variant="top"
            src={urlPhoto || process.env.PUBLIC_URL + "/assets/default.png"}
            className="rounded-start"
            alt="Restaurant"
            style={{ height: "100%" }}
          />
        </Col>
        <Col md={8}>
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
            <Card.Text>
              <div className="row">
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
              <div className="my-3">{restaurant.vicinity}</div>
              {photoAttribution && (
                <div dangerouslySetInnerHTML={{ __html: photoAttribution }} />
              )}
              <div className="mt-2">
                {restaurant.types?.map((type, index) => (
                  <Badge key={index} bg="secondary" className="mx-1">
                    {type}
                  </Badge>
                ))}
              </div>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default RestaurantModal;
