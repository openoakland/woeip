import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { theme } from 'theme'
import Navbar from 'components/Navbar'

import routes from 'routes'

import 'semantic-ui-css/semantic.min.css'
import 'components/App/index.css'

const App = () => (
  <ThemeProvider theme={theme}>
    <Navbar />
    <Switch>
      {routes.map(route => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  </ThemeProvider>
)

export default App
