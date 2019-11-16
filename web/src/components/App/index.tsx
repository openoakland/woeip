import Navbar from 'containers/Header'
import { ThemeProvider } from 'emotion-theming'
import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import routes from 'routes'
import 'semantic-ui-css/semantic.min.css'

const App = () => (
  <ThemeProvider theme={{}}>
    <Navbar />
    <Switch>
      {routes.map(route => (
        <Route
          key={route.path}
          exact={route.exact}
          component={route.component}
          path={route.path}
        />
      ))}
    </Switch>
  </ThemeProvider>
)

export default App
