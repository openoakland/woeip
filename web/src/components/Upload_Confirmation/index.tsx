import React, { useState, useEffect } from 'react'
import { Message, Icon, Button, Container } from 'semantic-ui-react'

import styled from 'theme'

const StyledContainer = styled(Container)`
  margin-top: 30px;
`

const ContentContainer = styled.div`
  width: 100%;
`

const SuccessBanner = styled(Message)`
  background: #619e54 !important;
  height: 48px;
  width: 100%;
  display: flex;
  border-radius: 4px;
  align-items: center;
  * {
    color: ${({ theme }) => theme.colors.white};
  }
  i.icon {
    font-size: 20px;
  }
`

const SuccessMessage = styled.span`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 16px;
`

const SuccessIcon = () => <Icon name='check circle outline' />

const UploadConfirmation: React.FunctionComponent = () => {
  return (
    <StyledContainer>
      <ContentContainer>
        <SuccessBanner>
          <SuccessIcon />
          <SuccessMessage>Success! Your files were uploaded.</SuccessMessage>
        </SuccessBanner>
      </ContentContainer>
    </StyledContainer>
  )
}

export default UploadConfirmation
