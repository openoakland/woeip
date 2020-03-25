import React from 'react'
import styled from 'theme'

const HomeContainer = styled.div`
  margin-top: 40px;
`

const HomeHeader = styled.div`
  display: flex;
  justify-content: center;
`

const Home = () => (
  <HomeContainer>
    <HomeHeader>
      <h2>Welcome to WOAQ</h2>
    </HomeHeader>
  </HomeContainer>
)

export default Home
