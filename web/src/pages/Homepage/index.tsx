import styled from '@emotion/styled'
import LoginForm from 'components/Login'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'
import TruckHero from 'images/truckshero.png'

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const Description = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 36px;
`

const LoginContainer = styled.div`
  display: flex;
  flex-flow: column;
`

const LoginFormHeader = styled.div`
  padding-bottom: 8px;
  div {
    margin-top: -8px;
    a {
      text-decoration: underline;
    }
  }
`

const Homepage: React.FunctionComponent<{}> = () => (
  <div>
    <Header textAlign="center" as="h1">
      Welcome to the West Oakland Air Quality Project
    </Header>
    <ContentWrapper>
      <Description>
        West Oakland Air Quality (WOAQ) supports the West Oakland Environmental
        Indicators Project by putting local air quality data in the hands of
        West Oaklanders.
      </Description>
    </ContentWrapper>
  </div>
)

export default Homepage
