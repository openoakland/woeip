import { useState, useContext } from "react";
import { PropTypes } from "prop-types";
import { Dimmer, Loader, Container } from "../ui";
import { getSessionDataLayerStyle } from "./utils";
import "./box.css";

import ReactMapGL, {
  NavigationControl,
  Source,
  Layer,
  MapContext,
} from "react-map-gl";
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
  const mapStyle = process.env.REACT_APP_MAPBOX_STYLE_URL;
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
        <SessionData pollutants={pollutants} />
      </ReactMapGL>
    </Container>
  );
};

const SessionData = ({ pollutants }) => {
  const context = useContext(MapContext);
  const stylesheet = context.map.style.stylesheet;
  if (stylesheet) {
    const dataLayers = stylesheet.layers.slice(118).map(({ id }) => id);
    for (let layer of dataLayers) {
      context.map.setLayoutProperty(layer, "visibility", "none");
    }
  }

  const getStyle = getSessionDataLayerStyle.bind(null, stylesheet);
  const markerStyle = getStyle("data-driven-circles");
  const labelStyle = getStyle("data-driven-circles-labels");

  return (
    <Source id="session-data" type="geojson" data={pollutants}>
      {markerStyle ? <Layer {...markerStyle} /> : null}
      {labelStyle ? <Layer {...labelStyle} /> : null}
    </Source>
  );
};

MapBox.protoTypes = {
  isLoading: PropTypes.bool,
  pollutants: PropTypes.array,
};
