import "./colorbar.css";
import { PM25_CATEGORY_COLORS } from "./box";

import { Popup } from "react-map-gl";

/**
 * Any given EPA color category contains a variable amount of air quality readings.
 * For example, the green GOOD category is 0 to 0.012 or 0.012 values long, while the orange
 * UNHEALTHY_SENSITIVE category is 0.035 to 0.055, or 0.02 values long.  We're using a colorbar
 * where each category is of the same length.  To represent these values on a color bar where
 * each color is the same length, each air quality value must be converted to a percentage
 * of the total linear distance along the single category it appears in.
 * The following calculation spreads the possible readings of each category along a range for just
 * that category's color, i.e., converting the nonlinear EPA color category ranges to linear colorbar ranges.
 * See https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf
 */
const ArrowPosition = (val, epaMin, epaMax, colorbarMin, colorbarMax) => {
  const epaRange = epaMax - epaMin;
  const colorbarRange = colorbarMax - colorbarMin;
  return ((val - epaMin) * colorbarRange) / epaRange + colorbarMin;
};

/**
 * Turns "2014-08-04 21:05:30" into "9:05:30 pm"
 * from https://stackoverflow.com/questions/4898574/converting-24-hour-time-to-12-hour-time-w-am-pm-using-javascript
 */
const FormatTime = (date) => {
  let d = new Date(date);
  let hh = d.getHours();
  let m = d.getMinutes();
  let s = d.getSeconds();
  let dd = "am";
  let h = hh;
  if (h >= 12) {
    h = hh - 12;
    dd = "pm";
  }
  if (h === 0) {
    h = 12;
  }
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  let pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
  let replacement = h + ":" + m;
  replacement += ":" + s;
  replacement += " " + dd;
  return date.replace(pattern, replacement).split(" ").slice(1).join(" ");
};

export const Hover = ({ info, closePopup, setUnitInfoDisplayed }) => {
  const val = info.feature.properties.value;
  const maxReading = 0.5;
  /* This value is used as a guess of the maximum possible (i.e. 100%) value of
   * any air sample reading in order to correctly position the hover's arrow along
   * the last (darkred) color in the colorbar.  Edit to match or exceed the max value
   * of all collections.
   */

  const ArrowProps = (val) => {
    if (val >= 0 && val <= 0.012) {
      return [
        PM25_CATEGORY_COLORS.GOOD,
        ArrowPosition(val, 0, 0.012, 0, 16.667),
      ];
    }
    if (val > 0.012 && val <= 0.035) {
      return [
        PM25_CATEGORY_COLORS.MODERATE,
        ArrowPosition(val, 0.012, 0.035, 16.667, 33.333),
      ];
    }
    if (val > 0.035 && val <= 0.055) {
      return [
        PM25_CATEGORY_COLORS.UNHEALTHY_SENSITIVE,
        ArrowPosition(val, 0.035, 0.055, 33.333, 50),
      ];
    }
    if (val > 0.055 && val <= 0.15) {
      return [
        PM25_CATEGORY_COLORS.UNHEALTHY,
        ArrowPosition(val, 0.055, 0.15, 50, 66.667),
      ];
    }
    if (val > 0.15 && val <= 0.25) {
      return [
        PM25_CATEGORY_COLORS.VERY_UNHEALTHY,
        ArrowPosition(val, 0.15, 0.25, 66.667, 83.333),
      ];
    }
    if (val > 0.25) {
      return [
        PM25_CATEGORY_COLORS.HAZARDOUS,
        ArrowPosition(val, 0.25, maxReading, 83.333, 100),
      ];
    }
  };

  const [pointerColor, pointerPosition] = ArrowProps(val);
  const pointerStyle = {
    borderBottomColor: `${pointerColor}`,
    left: `calc(${pointerPosition}% - var(--pointer-width)`,
  };
  const micrograms = val * 1000; // val is stored in units of milligrams per cubic meter but displayed in micrograms per cubic meter

  const otherHoverPts = info.features.slice(1, 5);
  var moreThanSixHoverPts = info.features.slice(6).length;
  if (!moreThanSixHoverPts) {
    moreThanSixHoverPts = null;
  }

  return (
    <Popup
      longitude={info.lng}
      latitude={info.lat}
      anchor="top-left"
      closeOnClick={false}
      closeButton={false}
    >
      <div className="close-button" onClick={closePopup}>
        &times;
      </div>
      <div>
        <b>
          {micrograms} &#181;g/m<sup>3</sup> of PM<sub>2.5</sub>
        </b>{" "}
        at {FormatTime(info.time)}{" "}
      </div>
      <div className="container">
        <div id="decoration">
          <div className="arrow-up" id="pointer" style={pointerStyle}></div>
          <div className="hover green"></div>
          <div className="hover yellow"></div>
          <div className="hover orange"></div>
          <div className="hover red"></div>
          <div className="hover violet"></div>
          <div className="hover darkred"></div>
        </div>
        <a
          href="https://www.airnow.gov/aqi/aqi-basics/"
          target="_blank"
          rel="noopener noreferrer"
          id="questionmark"
          onMouseEnter={() => setUnitInfoDisplayed(true)}
          onMouseLeave={() => setUnitInfoDisplayed(false)}
        >
          ?
        </a>
      </div>
      {otherHoverPts.length !== 0 && <div>Other nearby readings:</div>}
      {otherHoverPts &&
        otherHoverPts.map(({ properties }) => (
          <div key={properties.timestamp}>
            <div
              className="swatch"
              style={{ color: ArrowProps(properties.value)[0] }}
            >
              &#9632;
            </div>
            <div>
              <b>
                {properties.value * 1000} &#181;g/m<sup>3</sup> of PM
                <sub>2.5</sub>
              </b>{" "}
              at {FormatTime(properties.timestamp)}
            </div>
          </div>
        ))}
      {moreThanSixHoverPts && (
        <div>and {moreThanSixHoverPts} additional point(s)</div>
      )}
    </Popup>
  );
};
