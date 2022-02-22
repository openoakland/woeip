import './colorbar.css'
import { PM25_CATEGORY_COLORS } from './box'

export const Hover = ({hoverInfo}) => {

  // let pointer = document.getElementById('pointer')
  // pointer.style.borderBottomColor = PM25_CATEGORY_COLORS.VERY_UNHEALTHY
  // pointer.style.transform = "translateX(700%)";

  return (
    <div className="hovertip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
      <div>X,Y: {hoverInfo.x}, {hoverInfo.y}</div>
      <div>Points: {hoverInfo.count}</div>
      <div>Data: {hoverInfo.feature.properties.value}</div>
      <div class="container">
        <div id="decoration">
          <div class="arrow-up" id="pointer" style={{transform: `translateX(${hoverInfo.translate}%)`}}></div>
          <div class="hover" id="green"></div><div class="hover" id="yellow"></div><div class="hover" id="orange"></div><div class="hover" id="red"></div><div class="hover" id="blue"></div><div class="hover" id="purple"></div>
        </div>
      </div>
    </div>
  );
}