import { useState, useMemo } from "react";
import { PropTypes } from "prop-types";
import { Dimmer, Loader, Container } from "../ui";
import "./box.css";

import ReactMapGL, { NavigationControl, Source, Layer } from "react-map-gl";
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

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection",
      features: pollutants.map(({ longitude, latitude, ...properties }) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties,
      })),
    }),
    [pollutants]
  );

  const layerStyle = {
    type: "circle",
    layout: {},
    paint: {
      "circle-color": [
        "case",
        ["<=", ["get", "value"], 0.005],
        "hsl(134, 71%, 55%)",
        ["<=", ["get", "value"], 0.01],
        "hsl(65, 87%, 62%)",
        ["<=", ["get", "value"], 0.02],
        "hsl(36, 74%, 49%)",
        ["<=", ["get", "value"], 0.05],
        "hsl(0, 88%, 62%)",
        "hsl(281, 85%, 27%)",
      ],
    },
  };

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
        <Source id="session-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
      </ReactMapGL>
    </Container>
  );
};

MapBox.protoTypes = {
  isLoading: PropTypes.bool,
  pollutants: PropTypes.array,
};
