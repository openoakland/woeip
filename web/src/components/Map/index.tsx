import axios, { CancelToken } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ReactMapGL from 'react-map-gl'
// import styled from 'theme'
// import MapFilters from './ControlPanel'
import Pin from './Pin'
import { Pollutant, PollutantValueResponse, Viewport } from './types'
import {
  MAPBOX_ACCESS_TOKEN,
  MAP_STYLE,
  POLLUTANTS_API_URL
} from '../../constants'

// const MapContainer = styled.div`
//   position: relative;
//   margin-top: 40px;
// `

const initialViewport: Viewport = {
  zoom: 14,
  latitude: 37.812036,
  longitude: -122.286675,
  bearing: 0,
  pitch: 0
}

const parsePollutant = (item: PollutantValueResponse): Pollutant => {
  const timeGeoSplit = item.time_geo.split('(')
  const coordsSplit = timeGeoSplit[1].split(', ')
  return {
    timestamp: timeGeoSplit[0].trim(),
    longitude: Number(coordsSplit[0].trim()),
    latitude: Number(coordsSplit[1].replace(')', '').trim()),
    name: item.pollutant,
    value: item.value
  }
}

const Map: FunctionComponent<{}> = () => {
  const [pollutants, setPollutants] = useState<Array<Pollutant>>([])
  const [viewport, setViewport] = useState<Viewport>(initialViewport)

  const markers = pollutants.map(({ longitude, latitude }, index) => (
    <Pin key={index} coordinates={{ longitude, latitude }} />
  ))

  const getPollutants = async (token: CancelToken) => {
    try {
      const response = await axios.get<Array<PollutantValueResponse>>(
        POLLUTANTS_API_URL,
        { cancelToken: token }
      )
      const { data } = response
      const pollutantData = data.map(parsePollutant)
      setPollutants(pollutantData)
    } catch (e) {
      console.error(e)
    }
  }

  // Request pollutant values on mount
  useEffect(() => {
    const source = axios.CancelToken.source()
    getPollutants(source.token)
    return () => source.cancel()
  }, [])

  return (
    <div>
      <ReactMapGL
        {...viewport}
        width='100vw'
        height='100vh'
        mapStyle={MAP_STYLE}
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        {markers.length ? markers : null}
        {/* <MapFilters /> */}
      </ReactMapGL>
    </div>
  )
}

export default Map
