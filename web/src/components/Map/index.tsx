import styled from 'theme'
import React, {Component, Fragment} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import MapFilters from 'components/Map/ControlPanel';
import Pin from 'components/Map/Pin'

/*
  Map component is an extension of the react-map-gl library, which combines react and mapbox.
  The ReactMapGL component is essentially a reactified mapbox exctraction.
  Documentation lives here: https://uber.github.io/react-map-gl/#/Documentation/introduction/introduction

  TODO: Data will be populated via componentDidMount and D3, and overlaid onto the map
*/

interface IndividualPollutant {
  time_geo: string,
  pollutant: string,
  value: number
}

interface State {
  data: Array<PollutionCoordinate>,
  viewport: Viewport
}

interface Viewport {
  width: string,
  height: number,
  zoom: number,
  latitude: number,
  longitude: number
}

interface PollutionCoordinate {
  time: Date,
  coordinates: Coordinates,
  pollutant: string,
  value: number
}

interface Coordinates {
  latitude: number,
  longitude: number
}

const MapContainer = styled.div`
  position: relative;
  margin-top: 40px;
`

class Map extends Component {

  state: State = {
    data: [],
    viewport: {
      width: "100%",
      height: 600,
      zoom: 14,
      latitude: 37.812036,
      longitude: -122.286675
    }
  }

  _renderSpotMarker = (location:PollutionCoordinate) => {
    return (
      <Marker longitude={location.coordinates.longitude} latitude={location.coordinates.latitude}>
        <Pin />
      </Marker>
    );
  }
/*
  handleClick = (event) => {

  };

  onMarkerDragStart = (event) => {

  };

  onMarkerDrag = (event) => {

  };

  onMarkerDragEnd = (event) => {

  };
*/
  componentDidMount():void {
    fetch("http://api.lvh.me/pollutant_values")
    .then((response) => {
      return response.json();
    })
    .then((pollutionData) => {
      let pollutantCoordsAndValues = pollutionData.map((individualPollutant: IndividualPollutant, index: number): PollutionCoordinate => {
        const date = new Date(individualPollutant.time_geo.substr(0, individualPollutant.time_geo.indexOf(' (')).replace(' ', ':'))
        const startCut:number =  individualPollutant.time_geo.indexOf('(') + 1
        const endCut: number = individualPollutant.time_geo.indexOf(')')
        const [longitude, latitude] = individualPollutant.time_geo.slice(startCut, endCut).split(", ")
        return {
          time: date,
          coordinates: {
            latitude: +latitude,
            longitude: +longitude,
          },
          pollutant: individualPollutant.pollutant,
          value:  individualPollutant.value
        }
      })
      this.setState({data: pollutantCoordsAndValues})
    });
  }

  render() {
    return (
      <MapContainer className="map-container">
        <ReactMapGL
          {...this.state.viewport}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          onViewportChange={(viewport: Viewport) => this.setState({viewport})}
          mapboxApiAccessToken={'pk.eyJ1IjoibHVrZWh0cmF2aXMiLCJhIjoiY2p2djlmY2sxM3pzcDQzb2p3MXN3aGl2aSJ9.6b2Kp7pfaV-cNiwtYRhRZw'}
        >
          {
            this.state.data.length > 0 && (
              this.state.data.map(location => {
                return this._renderSpotMarker(location);
              })
            )

          }
          <MapFilters />
        </ReactMapGL>
      </MapContainer>
    )
  }
}

export default Map
