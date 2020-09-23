import axios, { CancelToken } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import moment from 'moment-timezone'
import styled from 'theme'
import { Container } from 'semantic-ui-react'
import ControlPanel from 'components/Map/ControlPanel'
// import MapFilters from 'components/Map/ControlPanel'
import Pin from 'components/Map/Pin'
import {
  Pollutant,
  PollutantValueResponse,
  Viewport
} from 'components/Map/types'
import {
  MAPBOX_ACCESS_TOKEN,
  MAP_STYLE,
  POLLUTANTS_API_URL
} from '../../constants'

const StyledContainer = styled(Container)`
  margin-top: 30px;
`

const ContentContainer = styled.div`
  margin: 0px 130px 92px 130px;
`

const LowerHalfContainer = styled.div`
  margin-top: 22px;
  display: flex;
`

const MapContainer = styled.div`
  height: 548px;
  width: 65%;
`

const ControlPanelContainer = styled.div`
  height: 548px;
  width: 35%;
  padding-left: 54px;
`

const FormMessage = styled.h3`
  font-size: 1.5rem;
`

const initialViewport: Viewport = {
  zoom: 12,
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
  const [date, setDate] = useState<moment.Moment>(moment())
  const [currentCollection, setCurrentCollection] = useState<any>()
  const [collections, setCollections] = useState<Array<any>>([])
  const [pollutants, setPollutants] = useState<Array<Pollutant>>([])
  const [viewport, setViewport] = useState<Viewport>(initialViewport)

  const markers = pollutants.map(({ longitude, latitude }, index) => (
    <Pin key={index} coordinates={{ longitude, latitude }} />
  ))

  const getCollections = async (token: CancelToken) => {
    const collectionDateRequest = axios.get<Array<PollutantValueResponse>>(
      `http://api.lvh.me/collection?start_date=${date.format('YYYY-MM-DD')}`,
      { cancelToken: token }
    )

    collectionDateRequest
      .then(data => {
        if (data.data.length > 0) {
          const collectionData = data.data.map(collection => collection)
          setCollections(collectionData)
          getPollutants(token, collectionData[0])
        } else {
          setPollutants([])
          setCollections([])
          setCurrentCollection(null)
        }
      })
      .catch(error => console.log(error))
  }

  const getPollutants = async (token: CancelToken, collection: any) => {
    setCurrentCollection(collection)
    const pollutantRequest = axios.get<Array<PollutantValueResponse>>(
      `http://api.lvh.me/collection/${collection.id}/data`,
      { cancelToken: token }
    )

    pollutantRequest
      .then(secondData => {
        const secondDataRetreived: any = secondData
        const pollutantData = secondDataRetreived.data.pollutant_values.map(
          parsePollutant
        )
        setPollutants(pollutantData)
      })
      .catch(error => console.log(error))
  }

  // Request pollutant values on mount
  useEffect(() => {
    const source = axios.CancelToken.source()
    getCollections(source.token)
    return () => source.cancel()
  }, [date])

  return (
    <StyledContainer>
      <ContentContainer>
        <FormMessage>View Maps</FormMessage>
        <LowerHalfContainer>
          <MapContainer>
            <ReactMapGL
              {...viewport}
              width='100%'
              height='100%'
              mapStyle={MAP_STYLE}
              onViewportChange={setViewport}
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            >
              {markers.length ? markers : null}
              {/* <MapFilters /> */}
            </ReactMapGL>
          </MapContainer>
          <ControlPanelContainer>
            <ControlPanel
              date={date}
              setDate={setDate}
              setPollutants={setPollutants}
              collections={collections}
              currentCollection={currentCollection}
              getPollutants={getPollutants}
            />
          </ControlPanelContainer>
        </LowerHalfContainer>
      </ContentContainer>
    </StyledContainer>
  )
}

export default Map
