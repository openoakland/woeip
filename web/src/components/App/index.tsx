import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import Navbar from 'components/Header'
import 'semantic-ui-css/semantic.min.css'
import './index.scss'
import styled, { theme } from 'theme'
import routes from 'routes'

const Main = styled.main`
  width: 100%;
  height: 100%;
  padding: 20px;
`

const App = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Main>
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Switch>
    </Main>
  </ThemeProvider>
)

export default App
