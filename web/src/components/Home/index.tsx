import React from 'react'
import styled from 'theme'

const HomeContainer = styled.div`
  padding: 40px;
`

class Home extends React.Component<{}, {}> {
  public render() {
    return <HomeContainer>Welcome to WOAQ!</HomeContainer>
  }
}

export default Home
