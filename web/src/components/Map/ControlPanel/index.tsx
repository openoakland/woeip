import React, { useState, useEffect, MouseEvent } from 'react'
import axios, { CancelToken } from 'axios'
import styled from 'theme'
import { ControlPanelProps } from 'components/Map/ControlPanel/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'
import { Console } from 'console'

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
`

const Header = styled.h3`
  font-size: 1.5rem;
`

const LabelContainer = styled.div`
  overflow: hidden;
`

const SessionLabelContainer = styled.div`
  overflow: hidden;
  margin-top: 40px;
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

const BoldedSessionLabel = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
`

const DateContainer = styled.div`
  padding-top: 5px;
  display: flex;
  .input {
    width: 140px;
  }
`

const NoDataContainer = styled.div`
  display: flex;
  height: 100%;
  margin-top: 30px;
`

const NoDataText = styled.label`
  font-weight: bold;
`

const SessionLabel = styled.p`
  text-decoration: underline;
  cursor: pointer;
`

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
          <SessionLabelContainer>
            <BoldedSessionLabel>Other sessions from this day:</BoldedSessionLabel>
            {collectionList()}
          </SessionLabelContainer>
        </div>
      )
    } else {
      return (
        <NoDataContainer>
          <NoDataText>No uploaded data available for this day</NoDataText>
        </NoDataContainer>
      )
    }
  }

  return (
    <Content>
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
    </Content>
  )
}

export default ControlPanel
