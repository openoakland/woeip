import { useState } from "react";

import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { Dimmer, Loader, Container } from "../ui";
import "./view.css";

/**
 * The map itself
 * @property {boolean} isLoading track whether we are in any state of loading
 * @property {Array<Pollutant>} pollutants
 */
export const MapView = ({ isLoading, pollutants }) => {
  const mapStyle = "mapbox://styles/mapbox/streets-v11";
  const mapboxApiAccessToken =
    "pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw";
  const initialViewport = {
    height: "100%",
    width: "100%",
    latitude: 37.803418,
    longitude: -122.294884,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  };

  const [viewport, setViewport] = useState(initialViewport);

  const markers = pollutants.map((coordinates, index) => (
    <Marker key={index} {...coordinates} className="circle-marker" />
  ));

  return (
    <Container className="map-view-container">
      <Dimmer active={isLoading}>
        <Loader indeterminate>Loading Pollutant Data...</Loader>
      </Dimmer>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapStyle}
        onViewStateChange={setViewport}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        {markers}
      </ReactMapGL>
    </Container>
  );
};
