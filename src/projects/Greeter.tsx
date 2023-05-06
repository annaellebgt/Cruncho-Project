import React from "react";

function Greeter(props: any) {
  const { first, last } = props;
  const testfunction = () => {
    if (navigator.geolocation) {
      console.log("hello");
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("test");
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Do something with the latitude and longitude
        console.log(lat, lng);
        return [lat, lng];
      });
    } else {
      // Geolocation is not supported by this browser
      console.log("not working");
      return [0, 0];
    }
    return [0, 0];
  };
  return (
    <div>
      hello, {first} {last}
      <button onClick={() => testfunction()}>Test</button>
    </div>
  );
}

export default Greeter;
