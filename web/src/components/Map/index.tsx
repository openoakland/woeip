import axios, { AxiosResponse, CancelToken } from 'axios'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import ReactMapGL from 'react-map-gl'
import moment from 'moment-timezone'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import { Collection, Coordinates } from 'components/Map/types'
import { initialViewport, getPollutants } from 'components/Map/utils'
import * as Elements from 'components/Map/elements'
import ControlPanel from 'components/Map/ControlPanel'
// import MapFilters from 'components/Map/ControlPanel'
import Pin from 'components/Map/Pin'
import { Pollutant, Viewport } from 'components/Map/types'
import { MAPBOX_ACCESS_TOKEN, MAP_STYLE, API_DOMAIN } from '../../constants'

const Map: FunctionComponent<{}> = props => {
  const [date, setDate] = useState<moment.Moment>(moment())
  const [currentCollection, setCurrentCollection] = useState<Collection>()
  const [collections, setCollections] = useState<Array<Collection>>([])
  const [pollutants, setPollutants] = useState<Array<Pollutant>>([])
  const [viewport, setViewport] = useState<Viewport>(initialViewport)
  const [loading, setLoading] = useState<boolean>(false)
  const location = useLocation()
  const history = useHistory()

  const markers = pollutants.map((coordinates: Coordinates, index: number) => (
    <Pin key={index} coordinates={coordinates} />
  ))

  const getCollections = async (token: CancelToken) => {
    axios
      .get<Array<Collection>>(
        `http://${API_DOMAIN}/collection?start_date=${date.format('YYYY-MM-DD')}`,
        { cancelToken: token }
      )
      .then((response: AxiosResponse<Array<Collection>>) => {
        if (response.data.length > 0) {
          const collections: Collection[] = response.data.map(
            (collection: Collection) => collection
          )
          setCollections(collections)
          const firstCollection = collections[0]
          const lastCollection = collections[collections.length - 1]

          //if we are coming from a push from the upload page - i.e there
          //exists a location state that's not empty, set most recent collection
          location.state !== undefined && Object.keys(location.state).length > 0
            ? setCurrentCollection(lastCollection)
            : setCurrentCollection(firstCollection)
          //clears location state so now just first collection is set
          history.replace({ pathname: '/maps', state: {} })
          setLoading(true)
          getPollutants(token, firstCollection.id)
            .then(pollutants => {
              if (pollutants) {
                setPollutants(pollutants as Pollutant[])
              } else {
                setPollutants([])
              }
              setLoading(false)
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
  //if pushed from upload, sets date to date from upload
  useEffect(() => {
    if (location.state) {
      if (!moment(location.state.date).isSame(date)) {
        setDate(moment(location.state.date))
      }
    }
  }, [])

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
            <Dimmer active={loading}>
              <Loader indeterminate>Loading Pollutant Data...</Loader>
            </Dimmer>
          </Elements.MapContainer>
          <Elements.ControlPanelContainer>
            <ControlPanel
              date={date}
              setDate={setDate}
              setPollutants={setPollutants}
              setLoading={setLoading}
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
