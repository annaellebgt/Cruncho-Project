import React, { useReducer, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { FaSearchLocation } from "react-icons/fa";
interface RestaurantListProps {
  restaurants: google.maps.places.PlaceResult[];
  currentPosition: google.maps.LatLng | null;
}

function calculateDistance(
  location1: google.maps.LatLng,
  location2: google.maps.LatLng
): number {
  return window.google.maps.geometry.spherical.computeDistanceBetween(
    location1,
    location2
  );
}

function sortRestaurants(
  restaurants: google.maps.places.PlaceResult[],
  sortOrder: string,
  currentPosition: google.maps.LatLng
): google.maps.places.PlaceResult[] {
  return restaurants.sort((a, b) => {
    switch (sortOrder) {
      case "rating":
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        } else return 0;

      case "proximity":
        if (a.geometry && b.geometry) {
          const distanceA = calculateDistance(
            currentPosition,
            a.geometry.location
          );
          const distanceB = calculateDistance(
            currentPosition,
            b.geometry.location
          );
          return distanceA - distanceB;
        } else {
          return 0;
        }
      default:
        return 0;
    }
  });
}

function RestaurantList({ restaurants, currentPosition }: RestaurantListProps) {
  type State = {
    searchQuery: string;
  };
  type Action = { type: "SEARCH_RESTAURANTS"; payload: string };

  const initialState: State = {
    searchQuery: "",
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SEARCH_RESTAURANTS":
        return {
          ...state,
          searchQuery: action.payload,
        };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const [orderBy, setOrderBy] = useState("proximity");

  let filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (restaurant.types &&
        restaurant.types.some((type) =>
          type.toLowerCase().includes(state.searchQuery.toLowerCase())
        ))
  );

  if (currentPosition) {
    filteredRestaurants = sortRestaurants(
      filteredRestaurants,
      orderBy,
      currentPosition
    );
  }

  function handleSearchTermChange(event: any) {
    dispatch({
      type: "SEARCH_RESTAURANTS",
      payload: event.target.value,
    });
  }

  return (
    <div>
      <Row className="align-items-center mb-3">
        <Col>
          <InputGroup className="ms-2">
            <div className="col d-flex align-items-center">
              <FaSearchLocation
                size={30}
                style={{ color: "#38648D" }}
                className="me-3"
              ></FaSearchLocation>
              <FormControl
                placeholder="Search restaurants by name, type ..."
                value={state.searchQuery}
                onChange={handleSearchTermChange}
              />
            </div>
          </InputGroup>
        </Col>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="orderBy"
            style={{ color: "#38648D" }}
            className="me-2"
          >
            <strong>Order By :</strong>
          </label>
          <Form.Select
            id="orderBy"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            style={{
              width: "10rem",
            }}
          >
            <option value="rating" className="">
              Rating
            </option>
            <option value="proximity">Proximity</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="row">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.name} className="col-sm-3 mb-3">
            <RestaurantCard
              restaurant={restaurant}
              currentPosition={currentPosition}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default RestaurantList;
