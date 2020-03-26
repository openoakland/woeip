import React, { FunctionComponent, useEffect, useState } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
// import styled from 'theme'
// import MapFilters from './ControlPanel'
import Pin from './Pin'

// TODO: Data will be populated via componentDidMount and D3, and overlaid onto the map

interface Coordinates {
  latitude: number
  longitude: number
}

interface Viewport extends Coordinates {
  bearing: number
  pitch: number
  zoom: number
}

interface Pollutant extends Coordinates {
  name: string
  timestamp: string
  value: number
}

// const MapContainer = styled.div`
//   position: relative;
//   margin-top: 40px;
// `

const VIEWPORT: Viewport = {
  zoom: 14,
  latitude: 37.812036,
  longitude: -122.286675,
  bearing: 0,
  pitch: 0
}

const POLLUTANTS_API = 'http://api.lvh.me/pollutant_values'
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11'
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN as string

const PollutantMarker: FunctionComponent<{ coordinates: Coordinates }> = ({
  coordinates
}) => (
  <Marker {...coordinates}>
    <Pin />
  </Marker>
)

const Map: FunctionComponent<{}> = () => {
  const [pollutants, setPollutants] = useState<Array<Pollutant>>([])
  const [viewport, setViewport] = useState<Viewport>(VIEWPORT)

  const pollutantMarkers = pollutants.map(({ longitude, latitude }, index) => (
    <PollutantMarker key={index} coordinates={{ longitude, latitude }} />
  ))

  const fetchPollutants = async (signal: AbortSignal) => {
    try {
      const response = await fetch(POLLUTANTS_API, { signal })
      const data: Array<Pollutant> = await response.json()
      setPollutants(data)
    } catch {
      return
    }
  }

  // Request pollutant values
  useEffect(() => {
    const abortController = new AbortController()
    fetchPollutants(abortController.signal)
    return () => {
      abortController.abort()
    }
  }, [pollutants])

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
        {pollutantMarkers.length ? pollutantMarkers : null}
        {/* <MapFilters /> */}
      </ReactMapGL>
    </div>
  )
}

export default Map
