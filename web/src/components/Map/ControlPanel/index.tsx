import React, { useState, useEffect, MouseEvent } from 'react'
import axios, { CancelToken } from 'axios'
import styled from 'theme'
import { ControlPanelProps } from 'components/Map/ControlPanel/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'
import { Console } from 'console'
import * as Elements from 'components/Map/ControlPanel/elements'

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
    collectionIdx: number
  ) => {
    setPollutants([])
    const source = axios.CancelToken.source()
    getPollutants(source.token, collections[collectionIdx])
  }

  const collectionList = () => {
    return collections
      .map((collection: any, idx) => {
        if (collection.id !== currentCollection.id) return idx + 1
      })
      .map(filteredKey => {
        if (filteredKey)
          return (
            <Elements.SessionLabel
              key={filteredKey}
              onClick={e => {
                changeSession(e, filteredKey - 1)
              }}
            >
              Session {filteredKey}
            </Elements.SessionLabel>
          )
      })
  }

  const sessionTime = (starts_at: any) => {
    const parsed = moment(starts_at)
    return parsed.format('h:mm A')
  }

  const sessionInformation = () => {
    if (collections.length > 0 && currentCollection) {
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
            {collectionList()}
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
