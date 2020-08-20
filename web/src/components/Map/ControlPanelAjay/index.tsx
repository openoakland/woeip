import React, { useState, useEffect } from 'react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'

const ControlPanel: React.FunctionComponent = () => {

  return (
    <div>
      <p>this is the control panel</p>
      <SemanticDatepicker />
    </div>
  )
}

export default ControlPanel