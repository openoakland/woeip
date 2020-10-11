import React from 'react'
import axios from 'axios'
import * as Elements from 'components/Map/ControlPanel/elements'
import { Collection } from 'components/Map/types'
import { ControlPanelProps } from 'components/Map/ControlPanel/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'

const ControlPanel = ({
  date,
  setDate,
  setPollutants,
  collections,
  currentCollection,
  getPollutants
}: ControlPanelProps) => {
  const changeDate = (event: any, data: any) => {
    setPollutants([])
    const parsed = moment(data.value)
    setDate(parsed)
  }

  const changeSession = (
    event: React.MouseEvent<HTMLSpanElement>,
    collectionIndex: number,
    collectionId: number
  ) => {
    setPollutants([])
    const source = axios.CancelToken.source()
    getPollutants(source.token, collections[collectionIndex], collectionId)
  }

  const sessionTime = (starts_at: string) => {
    const parsed = moment(starts_at)
    return parsed.format('h:mm A')
  }

  const collectionList = (): Array<React.ReactElement | ''> => {
    return collections.map((collection: Collection, index: number) => {
      const collectionId = collection.id
      if (collectionId !== currentCollection.id) {
        return (
          <Elements.SessionLabel
            key={collectionId}
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              changeSession(e, index, collectionId)
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
        <div>
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
        </div>
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
