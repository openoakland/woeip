import styled from '@emotion/styled'
import LoginForm from 'components/Login'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import TruckHero from 'images/truckshero.png'

let bodyStyle = {
  width: '70%',
  margin: '0 auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 40px;
  color: #fff;
`

const Header = styled.div`
  text-align: left;
  color: #fff;
  font-size: 44px;
  font-style: italic;
`

const Homepage: React.FunctionComponent<{}> = () => (
  <div className="hompage-body" style={bodyStyle}>
    <Header as="h1">Welcome to the West Oakland Air Quality Project</Header>
    <Description>
      <p>
        West Oakland Air Quality (WOAQ) supports the West Oakland Environmental
        Indicators Project by putting local air quality data in the hands of
        West Oaklanders.
      </p>
      <p>
        We operate in support of the West Oakland Environmental Indicators
        Project
      </p>
    </Description>
  </div>
)

export default Homepage
