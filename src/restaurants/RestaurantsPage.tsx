import React, { useEffect, useReducer } from "react";
import RestaurantList from "./RestaurantList";

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
    searchQuery: string;
  };

  type Action =
    | { type: "SET_CURRENT_POSITION"; payload: google.maps.LatLng }
    | { type: "SET_CURRENT_POSITION_LOADING"; payload: boolean }
    | { type: "FETCH_RESTAURANTS" }
    | {
        type: "FETCH_RESTAURANTS_SUCCESS";
        payload: google.maps.places.PlaceResult[];
      }
    | { type: "FETCH_RESTAURANTS_FAILURE"; payload: Error }
    | { type: "SEARCH_RESTAURANTS"; payload: string };

  const initialState: State = {
    currentPosition: null,
    currentPositionLoading: true,
    restaurants: [],
    loading: false,
    error: null,
    searchQuery: "",
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

  useEffect(() => {
    dispatch({ type: "SET_CURRENT_POSITION_LOADING", payload: true });

    // Get the user's current location
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

      // Call the Google Places API to get the nearby restaurants
      const request = {
        location: { lat: latitude, lng: longitude },
        radius: 500,
        type: ["restaurant"],
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
            dispatch({ type: "FETCH_RESTAURANTS_SUCCESS", payload: results });
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

  function handleSearchTermChange(event: any) {
    dispatch({
      type: "SEARCH_RESTAURANTS",
      payload: event.target.value,
    });
  }

  if (state.currentPositionLoading || state.loading) {
    return <div>Loading nearby restaurants...</div>;
  }

  if (state.error) {
    return <div>{state.error.message}</div>;
  } else
    return (
      <div>
        <h1>Nearby Restaurants</h1>
        <div>
          <input
            type="text"
            placeholder="Search restaurants..."
            value={state.searchQuery}
            onChange={handleSearchTermChange}
          />
        </div>
        <RestaurantList
          restaurants={state.restaurants}
          currentPosition={state.currentPosition}
          searchQuery={state.searchQuery}
        />
      </div>
    );
}

export default RestaurantsPage;
