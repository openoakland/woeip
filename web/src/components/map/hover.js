import './colorbar.css'

export const Hover = ({hoverInfo}) => {
    return (
      <div className="hovertip" style={{left: hoverInfo.x, top: hoverInfo.y}}>
        <div>X,Y: {hoverInfo.x}, {hoverInfo.y}</div>
        <div>Points: {hoverInfo.count}</div>
        <div>Data: {hoverInfo.feature.properties.value}</div>
        <div class="container">
          <div id="decoration">
            <div class="arrow-up" id="pointer"></div>
            <div class="hover" id="green"></div><div class="hover" id="yellow"></div><div class="hover" id="orange"></div><div class="hover" id="red"></div><div class="hover" id="blue"></div><div class="hover" id="purple"></div>
          </div>
        </div>
      </div>
    );
}