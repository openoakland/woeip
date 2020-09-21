import React, { useState, useEffect, MouseEvent } from 'react'
import axios, { CancelToken } from 'axios'
import styled from 'theme'
import { ControlPanelProps } from 'components/Map/ControlPanel/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'
import { Console } from 'console'

const Header = styled.h3`
  font-size: 1.5rem;
`

const LabelContainer = styled.div`
  overflow: hidden;
`

const Label = styled.p`
  font-size: 1rem;
  float: right;
`

const BoldedLabel = styled.p`
  font-size: 1rem;
  font-weight: bold;
  float: left;
  margin-bottom: 0.7rem;
`

const DateContainer = styled.div`
  display: flex;
`

const SessionLabel = styled.p`
  text-decoration: underline;
  cursor: pointer;
`

const ControlPanel = ({
  date,
  setDate,
  collections,
  currentCollection,
  getPollutants
}: ControlPanelProps) => {

  const changeDate = (event: any, data: any) => {
    const parsed = moment(data.value)
    setDate(parsed)
  }

  const changeSession = (
    event: React.MouseEvent<HTMLSpanElement>,
    collectionIdx: number
  ) => {
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
            <SessionLabel
              key={filteredKey}
              onClick={e => {
                changeSession(e, filteredKey - 1)
              }}
            >
              Session {filteredKey}
            </SessionLabel>
          )
      })
  }

  const sessionTime = (starts_at: any) => {
    const parsed = moment(starts_at)
    return parsed.format('h:mm A')
  }

  const sessionInformation = () => {
    if (collections.length > 0 && currentCollection) {
      debugger
      return (
        <div>
          <LabelContainer>
            <BoldedLabel>Session:</BoldedLabel>
            <label>{collections.indexOf(currentCollection) + 1}</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Start Time:</BoldedLabel>
            <label>{sessionTime(currentCollection.starts_at)}</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Collected By:</BoldedLabel>
            <label>Insert Collection User</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Device:</BoldedLabel>
            <label>Insert Device</label>
          </LabelContainer>
          {collectionList()}
        </div>
      )
    } else {
      return (
        <div>
          <label>There is no uploaded data available for this day</label>
        </div>
      )
    }
  }

  return (
    <div>
      <Header>{date.format('LL')}</Header>
      <DateContainer>
        <Label>View a different day</Label>
        <SemanticDatepicker
          onChange={changeDate}
          format='MM/DD/YYYY'
          value={date.toDate()}
          clearable={false}
        />
      </DateContainer>
      {sessionInformation()}
    </div>
  )
}

export default ControlPanel
