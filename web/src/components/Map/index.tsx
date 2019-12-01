import styled from 'theme'
import React, {Component, Fragment} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import MapFilters from 'components/Map/ControlPanel'

/*
  Map component is an extension of the react-map-gl library, which combines react and mapbox.
  The ReactMapGL component is essentially a reactified mapbox exctraction.
  Documentation lives here: https://uber.github.io/react-map-gl/#/Documentation/introduction/introduction

  TODO: Data will be populated via componentDidMount and D3, and overlaid onto the map
*/

const MapContainer = styled.div`
  position: relative;
  margin-top: 40px;
`

class Map extends Component {

  state = {
    viewport: {
      width: "100%",
      height: 600,
      zoom: 14,
      latitude: 37.812036,
      longitude: -122.286675
    }
  }


  handleClick = (event) => {

  };

  onMarkerDragStart = (event) => {

  };

  onMarkerDrag = (event) => {

  };

  onMarkerDragEnd = (event) => {

  };

  render() {

    return (
      <MapContainer className="map-container">
        <ReactMapGL
          {...this.state.viewport}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          onViewportChange={(viewport) => this.setState({viewport})}
          mapboxApiAccessToken={'pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw'}
        >
          <MapFilters />
        </ReactMapGL>
      </MapContainer>
    )
  }
}

export default Map
