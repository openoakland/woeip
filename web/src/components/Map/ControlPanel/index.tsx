import styled from 'theme'
import React, {Component} from 'react'
import {NavigationControl} from 'react-map-gl';

const FiltersContainer = styled.div`
  position: absolute;
  right: 20px;
  padding: 10px;
`

class MapFilters extends Component {
  render() {
    return(
      <FiltersContainer className="filters-container">
        <NavigationControl />
      </FiltersContainer>
    )
  }
}

export default MapFilters
