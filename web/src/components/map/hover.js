import './colorbar.css'
import { PM25_CATEGORY_COLORS } from './box'

/* Converts nonlinear EPA color category ranges to linear colorbar ranges
*/
const ArrowPosition = (val, oldMax, oldMin, newMax, newMin) => {
  const oldRange = oldMax - oldMin 
  const newRange = newMax - newMin
  return (((val - oldMin) * newRange) / oldRange) + newMin
}

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
  if (h == 0) {
    h = 12;
  }
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  let pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
  let replacement = h + ":" + m;
  replacement += ":"+s;
  replacement += " " + dd;
  return date.replace(pattern, replacement).split(' ').slice(1).join(' ');
}

export const Hover = ({hoverInfo}) => {

  const val = hoverInfo.feature.properties.value

  const ArrowProps = (val) => {
    if (val >= 0 && val <= 0.012) {
      return [ 
        PM25_CATEGORY_COLORS.GOOD, 
        ArrowPosition(val,0,0.012,0,16.667)
        ]
    }
    if (val > 0.012 && val <= 0.035) {
      return [ 
        PM25_CATEGORY_COLORS.MODERATE, 
        ArrowPosition(val,0.012,0.035,16.667,33.333) 
        ]
    }
    if (val > 0.035 && val <= 0.055) {
      return [
        PM25_CATEGORY_COLORS.UNHEALTHY_SENSITIVE,
        ArrowPosition(val,0.035,0.055,33.333,50) 
        ]
      }
    if (val > 0.055 && val <= 0.15) {
      return [
        PM25_CATEGORY_COLORS.UNHEALTHY,
        ArrowPosition(val,0.055,0.15,50,66.667) 
        ]
      }
    if (val > 0.15 && val <= 0.25) {
      return [
        PM25_CATEGORY_COLORS.VERY_UNHEALTHY,
        ArrowPosition(val,0.15,0.25,66.667,83.333) 
        ]
    }
    if (val > 0.25) {
      return [
        PM25_CATEGORY_COLORS.HAZARDOUS,
        ArrowPosition(val,0.25,0.5,83.333,100)
        ]
      }
  }

  const [ pointerColor, pointerPosition ] = ArrowProps(val)
  const PPM = val * 1000

  return (
    <div className="hovertip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
      <div><b>{PPM} PPM</b> at {FormatTime(hoverInfo.time)} </div>
      <div class="container">
        <div id="decoration">
          <div class="arrow-up" id="pointer" style={{borderBottomColor: `${pointerColor}`, left: `calc(${pointerPosition}% - var(--pointer-width)`}}></div>
          <div class="hover" id="green"></div><div class="hover" id="yellow"></div><div class="hover" id="orange"></div><div class="hover" id="red"></div><div class="hover" id="blue"></div><div class="hover" id="purple"></div>
        </div>
      </div>
      <div>{hoverInfo.count} total point(s)</div>
    </div>
  );
}