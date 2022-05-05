import { useState, useCallback } from "react";
import { PropTypes } from "prop-types";
import { Dimmer, Loader, Container } from "../ui";
import { Hover } from "./hover";
import "./box.css";

import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// Hack: https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-753662795
import mapboxgl from "mapbox-gl";
/* eslint-disable import/no-webpack-loader-syntax */
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
/* eslint-enable import/no-webpack-loader-syntax */

export const PM25_CATEGORY_COLORS = {
  GOOD: "#00E400",
  MODERATE: "#FFFF00",
  UNHEALTHY_SENSITIVE: "#FF7E00",
  UNHEALTHY: "#FF0000",
  VERY_UNHEALTHY: "#8F3F97",
  HAZARDOUS: "#7E0023",
};

const pollutantLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 5,
    "circle-color": [
      "step",
      ["get", "value"],
      PM25_CATEGORY_COLORS.GOOD,
      0.012,
      PM25_CATEGORY_COLORS.MODERATE,
      0.035,
      PM25_CATEGORY_COLORS.UNHEALTHY_SENSITIVE,
      0.055,
      PM25_CATEGORY_COLORS.UNHEALTHY,
      0.15,
      PM25_CATEGORY_COLORS.VERY_UNHEALTHY,
      0.25,
      PM25_CATEGORY_COLORS.HAZARDOUS,
    ],
  },
};

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

/**
 * The map itself
 * @property {boolean} isLoading track whether we are in any state of loading
 * @property {Array<Pollutant>} pollutants
 */
export const MapBox = ({ isLoading, pollutants }) => {
  const [viewport, setViewport] = useState(initialViewport);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverPinned, setHoverPinned] = useState(false);

  /**
   * Return points from the data layer on hover
   * Inspired by https://github.com/visgl/react-map-gl/blob/7.0-release/examples/geojson/src/app.tsx
   *   and https://visgl.github.io/react-map-gl/examples/controls
   */
  const onHover = useCallback((event) => {
    if (hoverPinned) return;
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const hoveredFeatures = features && features[0];
    setHoverInfo(
      hoveredFeatures
        ? {
            feature: hoveredFeatures,
            x: offsetX,
            y: offsetY,
            time: hoveredFeatures.properties.timestamp,
            count: features.length,
            features: features,
          }
        : null
    );
  }, [hoverPinned]);

  const onClick = useCallback((event) => {
    setHoverPinned(!hoverPinned);
  }, [hoverPinned]);

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
        interactiveLayerIds={["point"]}
        onHover={onHover}
        onClick={onClick}
      >
        <NavigationControl
          showCompass={false}
          className={"navigation-control"}
        />
        <Source id="pollutant-values" type="geojson" data={pollutants}>
          <Layer {...pollutantLayer} />
        </Source>
        {hoverInfo && <Hover hoverInfo={hoverInfo} />}
      </ReactMapGL>
    </Container>
  );
};

MapBox.protoTypes = {
  isLoading: PropTypes.bool,
  pollutants: PropTypes.shape({
    type: PropTypes.oneOf(["FeatureCollection"]),
    features: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(["Feature"]),
        properties: PropTypes.shape({
          value: PropTypes.number,
          timestamp: PropTypes.string,
        }),
        geometry: PropTypes.shape({
          type: PropTypes.oneOf(["Point"]),
          coordinates: PropTypes.arrayOf(PropTypes.number),
        }),
      })
    ),
  }),
};
