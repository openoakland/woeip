import React, { useState, useEffect } from 'react'
import styled from 'theme'
import { ControlPanelProps } from 'components/Map/ControlPanelAjay/types'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'

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

const ControlPanel = ({ date, setDate, collections, currentCollection}: ControlPanelProps) => {
  const onChange = (event, data) => {
    const parsed = moment(data.value)
    setDate(parsed)
  }

  const information = () => {
    if (collections.length > 0){
      return (
        <div>
          <LabelContainer>
            <BoldedLabel>Session:</BoldedLabel>
            <label>{collections.indexOf(currentCollection) + 1}</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Start Time:</BoldedLabel>
            <label>Insert Start Time</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Collected By:</BoldedLabel>
            <label>Insert Collection User</label>
          </LabelContainer>
          <LabelContainer>
            <BoldedLabel>Device:</BoldedLabel>
            <label>Insert Device</label>
          </LabelContainer>
          {collectionList}
        </div>
      )} else {
        return (
          <div>
            <label>There is no uploaded dada available for this day</label>
          </div>
        )
      }
  }

  const collectionList = collections.map(key => {
    if(key !== currentCollection) return key
  }).map(filteredKey => {
    return <p>{filteredKey}</p>
  })

  return (
    <div>
      <Header>{date.format('LL')}</Header>
      <DateContainer>
        <Label>View a different day</Label>
        <SemanticDatepicker
          onChange={onChange}
          format='MM/DD/YYYY'
          value={date.toDate()}
          clearable={false}
        />
      </DateContainer>
      {information()}
    </div>
  )
}

export default ControlPanel
