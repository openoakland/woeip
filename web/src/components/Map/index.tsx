import axios, { AxiosResponse, CancelToken } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import ReactMapGL from 'react-map-gl'
import moment from 'moment-timezone'
import { Collection, Coordinates } from 'components/Map/types'
import { initialViewport, getPollutants } from 'components/Map/utils'
import * as Elements from 'components/Map/elements'
import ControlPanel from 'components/Map/ControlPanel'
// import MapFilters from 'components/Map/ControlPanel'
import Pin from 'components/Map/Pin'
import { Pollutant, Viewport } from 'components/Map/types'
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE, API_URL } from '../../constants'

const Map: FunctionComponent<{}> = () => {
  const [date, setDate] = useState<moment.Moment>(moment())
  const [currentCollection, setCurrentCollection] = useState<Collection>()
  const [collections, setCollections] = useState<Array<Collection>>([])
  const [pollutants, setPollutants] = useState<Array<Pollutant>>([])
  const [viewport, setViewport] = useState<Viewport>(initialViewport)

  const markers = pollutants.map((coordinates: Coordinates, index: number) => (
    <Pin key={index} coordinates={coordinates} />
  ))

  const getCollections = async (token: CancelToken) => {
    axios
      .get<Array<Collection>>(
        `${API_URL}/collection?start_date=${date.format('YYYY-MM-DD')}`,
        { cancelToken: token }
      )
      .then((response: AxiosResponse<Array<Collection>>) => {
        if (response.data.length > 0) {
          const collections: Collection[] = response.data.map(
            (collection: Collection) => collection
          )
          setCollections(collections)
          const firstCollection = collections[0]
          setCurrentCollection(collections[0])
          console.log('hi')
          getPollutants(token, firstCollection.id)
            .then(pollutants => {
              if (pollutants){
                setPollutants(pollutants as Pollutant[])
              } else {
                setPollutants([])
              }
              console.log('hey')
            })
            .catch((error: Error) => console.log(error))
        } else {
          setPollutants([])
          setCollections([])
          setCurrentCollection(undefined)
        }
      })
      .catch(error => console.log(error))
  }

  // Request pollutant values on mount
  useEffect(() => {
    const source = axios.CancelToken.source()
    getCollections(source.token)
    return () => source.cancel('collection call cancelled')
  }, [date])

  return (
    <Elements.StyledContainer>
      <Elements.ContentContainer>
        <Elements.FormMessage>View Maps</Elements.FormMessage>
        <Elements.LowerHalfContainer>
          <Elements.MapContainer>
            <ReactMapGL
              {...viewport}
              width='100%'
              height='100%'
              mapStyle={MAP_STYLE}
              onViewportChange={setViewport}
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            >
              {markers.length ? markers : null}
            </ReactMapGL>
          </Elements.MapContainer>
          <Elements.ControlPanelContainer>
            <ControlPanel
              date={date}
              setDate={setDate}
              setPollutants={setPollutants}
              collections={collections}
              currentCollection={currentCollection as Collection}
              setCurrentCollection={setCurrentCollection}
              getPollutants={getPollutants}
            />
          </Elements.ControlPanelContainer>
        </Elements.LowerHalfContainer>
      </Elements.ContentContainer>
    </Elements.StyledContainer>
  )
}

export default Map
