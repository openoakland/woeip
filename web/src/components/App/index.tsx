import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import styled, { theme } from 'theme'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

import routes from 'routes'

import 'semantic-ui-css/semantic.min.css'
import './index.css'

const Content = styled.div`
  padding-bottom: 150px;
`

const App = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Content>
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Switch>
    </Content>
    <Footer />
  </ThemeProvider>
)

export default App
