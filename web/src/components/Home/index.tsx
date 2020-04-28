import React from 'react'
import styled from 'theme'
import { Container } from 'semantic-ui-react'

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  padding: 40px;
`

class Home extends React.Component<{}, {}> {
  public render() {
    return <StyledContainer>Welcome to WOAQ!</StyledContainer>
  }
}

export default Home
