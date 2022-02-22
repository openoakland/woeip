import './colorbar.css'
import { PM25_CATEGORY_COLORS } from './box'

export const Hover = ({hoverInfo}) => {

  const assignColor = (val) => {
    if (val >= 0 && val <= 0.012) {return PM25_CATEGORY_COLORS.GOOD}
    if (val > 0.012 && val <= 0.035) {return PM25_CATEGORY_COLORS.MODERATE}
    if (val > 0.035 && val <= 0.055) {return PM25_CATEGORY_COLORS.UNHEALTHY_SENSITIVE}
    if (val > 0.055 && val <= 0.15) {return PM25_CATEGORY_COLORS.UNHEALTHY}
    if (val > 0.15 && val <= 0.25) {return PM25_CATEGORY_COLORS.VERY_UNHEALTHY}
    if (val > 0.25) {return PM25_CATEGORY_COLORS.HAZARDOUS}
  }

  const val = hoverInfo.feature.properties.value
  const pointerColor = assignColor(val)

  return (
    <div className="hovertip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
      <div>X,Y: {hoverInfo.x}, {hoverInfo.y}</div>
      <div>Points: {hoverInfo.count}</div>
      <div>Data: {val}</div>
      <div>Time: {hoverInfo.time}</div>
      <div class="container">
        <div id="decoration">
          <div class="arrow-up" id="pointer" style={{transform: `translateX(${hoverInfo.translate}%)`, borderBottomColor: `${pointerColor}`}}></div>
          <div class="hover" id="green"></div><div class="hover" id="yellow"></div><div class="hover" id="orange"></div><div class="hover" id="red"></div><div class="hover" id="blue"></div><div class="hover" id="purple"></div>
        </div>
      </div>
    </div>
  );
}