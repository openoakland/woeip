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
    pinned: false,
  });
  const [unitInfoDisplayed, setUnitInfoDisplayed] = useState(false);

  /**
   * Return info from the data layer on hover. If there's no data there, return `null`.
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
   * The react-mapbox-gl events passed to onHover include info from the data layer. Use it to update hoverInfo.
   * This callback seems to get called each time the cursor arrives at a new location, whether or not there is
   * data in the data layer at that point.
   * There are three cases.
   * - The popup is pinned open while the user moves the cursor to a new location. Either the mouse is up and the user
   *   might click the new point, or the mouse is down and they're either dragging the map canvas (to pan) or dragging starting on the
   *   popup (which should do nothing). We want to store any new info in case they click the new point,
   *   but we don't want to display that info until the click unpins the current popup.
   * - The popup is not pinned open, and the mouse is down when the cursor is moved to a new location. The user is
   *   dragging the map around to pan it. Continue updating the info just in case, although ideally the cursor shouldn't
   *   hover over anything new during panning.
   * - The popup is not pinned open, and the mouse is up. The user is hovering over a point, which might be in the data layer.
   *   Update the popup with the new info so that the hovering popup follows the cursor around (or disappears when the cursor
   *   is not over a point in the data layer).
   * This and the four subsequent callback definitions include an arrow function in calls to setInfo. React passes the current value
   * of info to that arrow function, and what the arrow function returns is then assigned as the new value of info.
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
      // mouse was down and has now moved -> drag, not click -> store info but don't display
      else if (info.mouseIsDownForClick) {
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

  /**
   * We don't want the popup to update while the mouse is down. It could be a click on a data
   * point, a click on the map canvas, or a drag. For some reason the react-map-gl events passed to
   * onMouseDown do not include info from the data layer, so we let onHover take care of that and
   * store the most recent info in the state for onMouseUp to use.
   *     We can't just use react-map-gl's onClick callback functionality because in the split second between
   * when the mouseUp happens and when the event fires, the user may move the mouse. This causes the hover popup to
   * move and follow the cursor before jumping back to the location of the click, which is startling and confusing.
   */
  const onMouseDown = useCallback((event) => {
    // don't do anything unless this mouseDown happened on the canvas (not the popup)
    if (event.target.className !== "overlays") return;
    // don't display new info until we know if this is a click or not
    setInfo((info) => {
      return {
        ...info,
        mouseIsDownForClick: true,
      };
    });
  }, []);

  /**
   * Handle three possible cases:
   * - The user just moved the mouse after pressing it down on the canvas. This is a drag, not a click, and we want onMouseUp to
   *   know that, so update mouseIsDownForClick to false.
   * - The mouse was up when the mouse was moved. This case is handled by onHover already, so don't do anything else.
   * - Although mouseIsDownForClick is false, the mouse actually was down on the popup and now it has been moved. This is a drag,
   *   and mouseIsDownForClick is already false, so don't do anything.
   */
  const onMouseMove = useCallback((event) => {
    setInfo((info) => {
      if (info.mouseIsDownForClick) {
        // mouse was down to drag -> not a click
        return {
          ...info,
          mouseIsDownForClick: false,
        };
      }
      // Either the mouse was up and onHover will handle this, or the mouseDown happened
      // on the popup. In either case, don't do anything
      else return info;
    });
  }, []);

  /**
   * Handle four possible cases:
   * - The user clicked on a point in the data layer. Update the popup with info from that layer.
   * - The user clicked on a blank part of the map canvas. Close the popup.
   * - The user clicked somewhere on the popup. Do nothing.
   * - The user dragged the map. Do nothing.
   * In each case, make sure mouseIsDownForClick is now false.
   */
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
            mouseIsDownForClick: false,
          };
        }
        // the click happened on a blank part of the map, so make sure nothing is pinned
        // and nothing is displayed
        else
          return {
            ...info,
            pinned: false,
            displayedInfo: null,
            mouseIsDownForClick: false,
          };
      }
      // This handles the last two cases.
      // - The click happened on a popup, so mouseIsDownForClick was never set to true.
      // - The mouse was moved while it was down, so this was a drag and mouseIsDownForClick was set back to false.
      // In either case, don't do anything.
      else return info;
    });
  }, []);

  /**
   * Call this callback when the user clicks the X in the top right corner of the popup.
   */
  const closePopup = useCallback((event) => {
    setInfo((info) => ({
      pinned: false,
      displayedInfo: null,
    }));
  }, []);

  const showUnitInfo = (event) => {
    setUnitInfoDisplayed(true);
  }

  const hideUnitInfo = (event) => {
    setUnitInfoDisplayed(false);
  }

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
        {info.displayedInfo && (
          <Hover info={info.displayedInfo} closePopup={closePopup} showHideUnitInfo={{showUnitInfo, hideUnitInfo}}/>
        )}
      </ReactMapGL>
      {unitInfoDisplayed && (
        <div className="unit-info">
          <p>PM<sub>2.5</sub> given in units of &#956;g/m<sup>3</sup> (different from AQI).
          The color shows the corresponding AQI range.</p>
          <p>Click for more information from the EPA website.</p>
        </div>
      )}
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
