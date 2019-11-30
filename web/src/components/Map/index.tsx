import React, {Component, Fragment} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "100%",
        height: 400,
        zoom: 10,
      }
    };
  }

  handleClick = (event) => {

  };

  onMarkerDragStart = (event) => {

  };

  onMarkerDrag = (event) => {

  };

  _updateViewport = viewport => {

  };

  onMarkerDragEnd = (event) => {

  };

  render() {

    return (
      <ReactMapGL
        {...this.state.viewport}
        latitude={37.812036}
        longitude={-122.286675}
        mapboxApiAccessToken={'pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw'}
      >
      </ReactMapGL>
    )
  }
}

export default Map
