import Navbar from 'containers/Header'
import { ThemeProvider } from 'emotion-theming'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import routes from 'routes'
import 'semantic-ui-css/semantic.min.css'

const App = () => (
  <ThemeProvider theme={{}}>
    <Navbar />
    <Switch>
      {routes.map(route => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  </ThemeProvider>
)

export default App
