import styled from 'theme'
import React, {Component} from 'react'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import {NavigationControl} from 'react-map-gl';
import moment from 'moment'
import './index.css'

/*
  This MapFilters component will allow users to choose a date range to represent on the WOEIP Map
  It also allows users to zoom in and out of the map using arrows via the NavigationControl component
  State of dates is controlled by the SemanticDatepicker component, which was imported from the npm library of that name
  -Lt
*/

const FiltersContainer = styled.div`
  position: absolute;
  left: 20px;
  padding: 10px;
  min-width: 250px;
`

class MapFilters extends Component {


  dateChange = (event, dates) => {
    // dateChange will
    // 1. Recieve date range (dates) from the datePicker
    // 2. Convert dates to a timestamp
    // 3. Send dates back up to the Map component
    let formattedDates = []
    // If statement checks to ensure two dates have been picked, since a range is required
    if (dates.value.length === 2) {
      formattedDates = dates.value.map(date => {
        return moment(date)
      })

    }
  }

  render() {
    return(
      <FiltersContainer className="filters-container">
        <SemanticDatepicker format="MMM D, YYYY" onChange={this.dateChange} type="range" className="date-picker" />
        <NavigationControl className="navigation-control" />
      </FiltersContainer>
    )
  }
}

export default MapFilters
