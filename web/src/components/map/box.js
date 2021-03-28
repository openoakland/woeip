import { useState } from "react";
import { PropTypes } from "prop-types";
import { Dimmer, Loader, Container } from "../ui";
import "./box.css";

import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// Hack: https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-753662795
import mapboxgl from "mapbox-gl";
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

/**
 * The map itself
 * @property {boolean} isLoading track whether we are in any state of loading
 * @property {Array<Pollutant>} pollutants
 */
export const MapBox = ({ isLoading, pollutants }) => {
  const mapStyle = "mapbox://styles/mapbox/streets-v11";
  const mapboxApiAccessToken = process.env.REACT_APP_MAPBOX_TOKEN;
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

  /**
   * For each pollutant, create a "marker" component at its lat and long
   * Use css to give each pollutant its appearance
   */
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
        <NavigationControl
          showCompass={false}
          className={"navigation-control"}
        />
        {markers}
      </ReactMapGL>
    </Container>
  );
};

MapBox.protoTypes = {
  isLoading: PropTypes.bool,
  pollutants: PropTypes.array,
};
