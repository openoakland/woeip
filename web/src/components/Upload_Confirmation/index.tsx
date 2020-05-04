import React, { useState, useEffect } from 'react'
import { Message, Icon, Button, Container } from 'semantic-ui-react'

import styled from 'theme'

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  padding: 40px;
`

const UploadConfirmation: React.FunctionComponent = () => {
  return (
    <StyledContainer>This is the upload confirmation page!</StyledContainer>
  )
}

export default UploadConfirmation
