import styled from '@emotion/styled'
import LoginForm from 'components/Login'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Header } from 'semantic-ui-react'

const StyledContainer = styled(Container)`
  margin-top: 96px;
  display: flex !important;
  justify-content: center;
  flex-flow: column;
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 64px;
  & > div {
    width: 50%;
  }
  div + div {
    margin-left: 48px;
  }
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
  <StyledContainer>
    <Header textAlign="center" as="h1">
      Welcome to the West Oakland Air Quality Project
    </Header>
    <ContentWrapper>
      <Description>
        West Oakland Air Quality (WOAQ) supports the West Oakland Environmental
        Indicators Project by putting local air quality data in the hands of
        West Oaklanders.
      </Description>
      <LoginContainer>
        <LoginFormHeader>
          <Header as="h3">Sign in to upload data</Header>
          <div>
            Or <Link to="/register">create an account</Link>
          </div>
        </LoginFormHeader>
        <LoginForm />
      </LoginContainer>
    </ContentWrapper>
  </StyledContainer>
)

export default Homepage
