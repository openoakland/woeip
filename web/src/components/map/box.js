import { useState, useMemo, useRef, useEffect } from "react";
import { PropTypes } from "prop-types";
import { Dimmer, Loader, Container } from "../ui";
import { formatPollutantsToGeoJSON, getSessionDataLayerStyle } from "./utils";
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
  const mapStyle = "mapbox://styles/kbrdsk/cklmsulop45dm17r0e50s471k";
  const mapboxApiAccessToken =
    "pk.eyJ1Ijoia2JyZHNrIiwiYSI6ImNrbGpyc2d2dDA5MjMydnAzdjZheHoyOW0ifQ.28bD5wud6KEpjNakfMZh0Q";
  const initialViewport = {
    height: "100%",
    width: "100%",
    latitude: 37.803418,
    longitude: -122.294884,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  };
  const geojson = useMemo(() => formatPollutantsToGeoJSON(pollutants), [
    pollutants,
  ]);
  const mapRef = useRef();
  const stylesheet = mapRef.current?.getMap().style.stylesheet;

  const [viewport, setViewport] = useState(initialViewport);
  const [layerStyle, setLayerStyle] = useState(null);

  useEffect(() => {
    setLayerStyle(getSessionDataLayerStyle(stylesheet));
  }, [stylesheet]);

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
        ref={mapRef}
      >
        <NavigationControl
          showCompass={false}
          className={"navigation-control"}
        />
        {layerStyle ? (
          <Source id="session-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        ) : null}
      </ReactMapGL>
    </Container>
  );
};

MapBox.protoTypes = {
  isLoading: PropTypes.bool,
  pollutants: PropTypes.array,
};
