import React, { useState, useEffect } from 'react'
import styled from 'theme'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'
import moment from 'moment-timezone'

const FormMessage = styled.h3`
  font-size: 1.5rem;
`

const ControlPanel: React.FunctionComponent = () => {
  const [date, setDate] = useState<moment.Moment>(moment())

  const onChange = (event, data) => {
    const parsed = moment(data.value)
    setDate(parsed)
  }

  return (
    <div>
      <FormMessage>{date.format('LL')}</FormMessage>
      <SemanticDatepicker
        onChange={onChange}
        format='MM/DD/YYYY'
        value={date.toDate()}
        clearable={false}
      />
    </div>
  )
}

export default ControlPanel
