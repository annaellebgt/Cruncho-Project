import React from "react";
import logo from "./logo.svg";
import Button from "react-bootstrap/Button";
import "./App.css";
import Greeter from "./projects/Greeter";
import RestaurantsPage from "./restaurants/RestaurantsPage";

function App() {
  return (
    <div className="container">
      {/* <Greeter first="Sandrine" last="Quetier"></Greeter> */}
      <RestaurantsPage />
    </div>
  );
}

export default App;
