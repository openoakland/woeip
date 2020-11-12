import React from 'react'
import axios from 'axios'
import * as Elements from 'components/Map/ControlPanel/elements'
import { Pollutant, Collection } from 'components/Map/types'
import { ControlPanelProps } from 'components/Map/ControlPanel/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { SemanticDatepickerProps } from 'react-semantic-ui-datepickers/dist/types'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'

const ControlPanel = ({
  date,
  setDate,
  setPollutants,
  collections,
  currentCollection,
  setCurrentCollection,
  getPollutants
}: ControlPanelProps): React.ReactElement => {
  const changeDate = (
    _event: React.SyntheticEvent | undefined,
    data: SemanticDatepickerProps
  ) => {
    const dateLocal: Date | null = data.value as Date | null
    if (dateLocal !== null) {
      setPollutants([])
      setDate(moment(dateLocal.toISOString()))
    }
  }

  const changeSession = (
    _event: React.MouseEvent<HTMLSpanElement>,
    collection: Collection,
    collectionId: number
  ) => {
    setPollutants([])
    const source = axios.CancelToken.source()
    setCurrentCollection(collection)
    console.log('hi')
    getPollutants(source.token, collectionId)
      .then(pollutants => {
        if (pollutants) {
          setPollutants(pollutants as Pollutant[])
        } else {
          setPollutants([])
        }
        console.log('hey')
      })
      .catch((error: Error) => console.log(error))
  }

  const openData = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    window.open(`${currentCollection.collection_files[0]}`)
    window.open(`${currentCollection.collection_files[1]}`)
  }

  const sessionTime = (starts_at: string) => {
    const parsed = moment(starts_at)
    return parsed.format('h:mm A')
  }

  const collectionList = (): Array<React.ReactElement | ''> => {
    return collections.map((collection: Collection, index: number) => {
      const collectionId: number = collection.id
      if (collectionId !== currentCollection.id) {
        return (
          <Elements.SessionLabel
            key={collectionId}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              changeSession(e, collection, collectionId)
            }}
          >
            Session {index + 1}
          </Elements.SessionLabel>
        )
      } else return ''
    })
  }

  const sessionInformation = () => {
    if (currentCollection) {
      return (
        <Elements.SessionDataContainer>
          <Elements.LabelContainer>
            <Elements.BoldedLabel>Session:</Elements.BoldedLabel>
            <Elements.TextLabel>
              {collections.indexOf(currentCollection) + 1}
            </Elements.TextLabel>
          </Elements.LabelContainer>
          <Elements.LabelContainer>
            <Elements.BoldedLabel>Start Time:</Elements.BoldedLabel>
            <Elements.TextLabel>
              {sessionTime(currentCollection.starts_at)}
            </Elements.TextLabel>
          </Elements.LabelContainer>
          <Elements.LabelContainer>
            <Elements.BoldedLabel>Collected By:</Elements.BoldedLabel>
            <Elements.TextLabel>Insert Collection User</Elements.TextLabel>
          </Elements.LabelContainer>
          <Elements.LabelContainer>
            <Elements.BoldedLabel>Device:</Elements.BoldedLabel>
            <Elements.TextLabel>Insert Device</Elements.TextLabel>
          </Elements.LabelContainer>
          <Elements.SessionLabelContainer>
            <Elements.BoldedSessionLabel>
              Other sessions from this day:
            </Elements.BoldedSessionLabel>
            {collections.length > 1 ? (
              collectionList()
            ) : (
              <Elements.NoDataText>None</Elements.NoDataText>
            )}
          </Elements.SessionLabelContainer>
          <Elements.ViewDataLabel
            onClick={e => {
              openData(e)
            }}
          >
            Download Raw Data
          </Elements.ViewDataLabel>
        </Elements.SessionDataContainer>
      )
    } else {
      return (
        <Elements.NoDataContainer>
          <Elements.NoDataText>
            No uploaded data available for this day
          </Elements.NoDataText>
        </Elements.NoDataContainer>
      )
    }
  }

  return (
    <Elements.Content>
      <Elements.Header>{date.format('LL')}</Elements.Header>
      <Elements.DateContainer>
        <Elements.Label>View a different day</Elements.Label>
        <SemanticDatepicker
          onChange={changeDate}
          format='MM/DD/YYYY'
          value={date.toDate()}
          clearable={false}
        />
      </Elements.DateContainer>
      {sessionInformation()}
    </Elements.Content>
  )
}

export default ControlPanel
