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
  const [info, setInfo] = useState({
    displayedInfo: null,
    hoverInfo: null,
    mouseIsDownForClick: false,
    pinned: false
  });

  /**
   * Return points from the data layer on hover
   * Inspired by https://github.com/visgl/react-map-gl/blob/7.0-release/examples/geojson/src/app.tsx
   *   and https://visgl.github.io/react-map-gl/examples/controls
   */
  const getHoverInfo = (event) => {
    const { features, lngLat } = event;
    const hoveredFeatures = features && features[0];
    return hoveredFeatures
      ? {
          feature: hoveredFeatures,
          lng: lngLat[0],
          lat: lngLat[1],
          time: hoveredFeatures.properties.timestamp,
          count: features.length,
          features: features,
        }
      : null;
  };

  /**
   * onHover has access to info from the data layer. Update it as appropriate 
   */
  const onHover = useCallback((event) => {
    // passing a function to setInfo updates info based on current state
    setInfo((info) => {
      const newHoverInfo = getHoverInfo(event);
      if (info.pinned) {
        // previously clicked info pinned open -> store info but don't display
        return {
          ...info,
          hoverInfo: newHoverInfo,
        };
      }
      if (info.mouseIsDownForClick) {
        // mouse was down and has now moved -> drag, not click -> store info but don't display
        return {
          ...info,
          hoverInfo: newHoverInfo,
        };
      }
      // mouse was not down when new point was hovered over and nothing is pinned open -> display hover info
      else {
        return {
          ...info,
          displayedInfo: newHoverInfo,
          hoverInfo: newHoverInfo,
        };
      }
    });
  }, []);

  const onMouseMove = useCallback((event) =>
    setInfo((info) => {
      if (info.mouseIsDownForClick){
        // mouse was down to drag -> not a click
        return {
          ...info,
          mouseIsDownForClick: false
        };
      }
      // mouse was up -> hover will handle this
      return info;
    }), []);

  // for some reason onMouseDown has no access to features, so
  // borrow them from previous event
  const onMouseDown = useCallback((event) => {
    // don't display new info until we know if this is a click or not
    setInfo((info) => {
      return {
        ...info,
        mouseIsDownForClick: true
      }
    });
  }, []);

  const onMouseUp = useCallback((event) => {
    setInfo((info) => {
      if (info.mouseIsDownForClick) {
        // mouse has not moved since mouseDown -> this is a click
        if (info.hoverInfo) {
          // the click happened on a point, so pin that info
          return {
            ...info,
            pinned: true,
            displayedInfo: info.hoverInfo,
            mouseIsDownForClick: false
          }
        }
        // the click happened on a blank part of the map, so make sure nothing is pinned
        // and nothing is displayed
        return {
          ...info,
          pinned: false,
          displayedInfo: null,
          mouseIsDownForClick: false
        }
      }
      // mouse has moved while down -> this was a drag -> don't do anything
      return info;
    });
  }, []);

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
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <NavigationControl
          showCompass={false}
          className={"navigation-control"}
        />
        <Source id="pollutant-values" type="geojson" data={pollutants}>
          <Layer {...pollutantLayer} />
        </Source>
        {info.displayedInfo && <Hover info={info.displayedInfo}/>}
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
