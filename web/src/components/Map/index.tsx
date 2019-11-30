import styled from 'theme'
import React, {Component, Fragment} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import MapFilters from 'components/Map/ControlPanel'

const MapContainer = styled.div`
  position: relative;
  margin-top: 40px;
`


class Map extends Component<Viewport> {

  state = {
    viewport: {
      width: "100%",
      height: 700,
      zoom: 14,
    }
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
      <MapContainer className="map-container">
        <ReactMapGL
          {...this.state.viewport}
          latitude={37.812036}
          longitude={-122.286675}
          mapboxApiAccessToken={'pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw'}
        >
          <MapFilters />
        </ReactMapGL>
      </MapContainer>
    )
  }
}

export default Map
