import React from "react";
import { Badge, Card } from "react-bootstrap";

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
  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Header>
          <img
            src={urlPhoto || process.env.PUBLIC_URL + "/assets/default.png"}
            alt="Restaurant"
            style={{ maxWidth: 350, maxHeight: 250 }}
          />
        </Card.Header>
        <Card.Title>{restaurant.name}</Card.Title>

        <Card.Text>Rating: {restaurant.rating}</Card.Text>
        <Card.Text>Address : {restaurant.vicinity}</Card.Text>
        <Card.Text>Distance: {distance}</Card.Text>

        <Card.Text>
          Icon : <img src={restaurant.icon} alt="..."></img>
        </Card.Text>
        <Card.Text>Url : {restaurant.url}</Card.Text>
        <Card.Text>
          User Rating Total : {restaurant.user_ratings_total}
        </Card.Text>

        {photoAttribution && (
          <div dangerouslySetInnerHTML={{ __html: photoAttribution }} />
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

export default RestaurantModal;
