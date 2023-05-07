import React, { useEffect, useReducer } from "react";
import RestaurantList from "./RestaurantList";
import { Container } from "react-bootstrap";
import "./Restaurants.css";

declare global {
  interface Window {
    google: any;
  }
}

function RestaurantsPage() {
  type State = {
    currentPosition: google.maps.LatLng | null;
    currentPositionLoading: boolean;
    restaurants: google.maps.places.PlaceResult[];
    loading: boolean;
    error: Error | null;
  };

  type Action =
    | { type: "SET_CURRENT_POSITION"; payload: google.maps.LatLng }
    | { type: "SET_CURRENT_POSITION_LOADING"; payload: boolean }
    | { type: "FETCH_RESTAURANTS" }
    | {
        type: "FETCH_RESTAURANTS_SUCCESS";
        payload: google.maps.places.PlaceResult[];
      }
    | { type: "FETCH_RESTAURANTS_FAILURE"; payload: Error };

  const initialState: State = {
    currentPosition: null,
    currentPositionLoading: true,
    restaurants: [],
    loading: false,
    error: null,
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "SET_CURRENT_POSITION":
        return {
          ...state,
          currentPosition: action.payload,
          currentPositionLoading: false,
        };
      case "SET_CURRENT_POSITION_LOADING":
        return {
          ...state,
          currentPositionLoading: action.payload,
        };
      case "FETCH_RESTAURANTS":
        return {
          ...state,
          loading: true,
          error: null,
        };
      case "FETCH_RESTAURANTS_SUCCESS":
        return {
          ...state,
          loading: false,
          restaurants: action.payload,
        };
      case "FETCH_RESTAURANTS_FAILURE":
        return {
          ...state,
          loading: false,
          error: action.payload,
        };

      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_CURRENT_POSITION_LOADING", payload: true });

    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const currentPosition = new window.google.maps.LatLng(
        latitude,
        longitude
      );

      dispatch({
        type: "SET_CURRENT_POSITION",
        payload: currentPosition,
      });

      const request = {
        location: { lat: latitude, lng: longitude },
        type: ["restaurant"],
        rankBy: google.maps.places.RankBy.DISTANCE,
      };
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      dispatch({ type: "FETCH_RESTAURANTS" });
      service.nearbySearch(
        request,
        (
          results: google.maps.places.PlaceResult[],
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const topTenResults = results.slice(0, 10);
            dispatch({
              type: "FETCH_RESTAURANTS_SUCCESS",
              payload: topTenResults,
            });
          } else {
            dispatch({
              type: "FETCH_RESTAURANTS_FAILURE",
              payload: new Error("Failed to fetch restaurants"),
            });
          }
        }
      );
    });
  }, []);

  if (state.loading) {
    return <div className="my-3">Loading nearby restaurants...</div>;
  }

  if (state.currentPositionLoading) {
    return (
      <div className="my-3">
        Your geolocation is needed to display the top 10 nearby restaurants
      </div>
    );
  }

  if (state.error) {
    return <div>{state.error.message}</div>;
  } else
    return (
      <Container>
        <h1 className="my-3 title-page">Top 10 Nearby Restaurants</h1>
        <RestaurantList
          restaurants={state.restaurants}
          currentPosition={state.currentPosition}
        />
      </Container>
    );
}

export default RestaurantsPage;
