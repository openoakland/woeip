import Navbar from 'containers/Header'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import routes from 'routes'
import 'semantic-ui-css/semantic.min.css'

const App = () => (
  <Switch>
    <Navbar loggedIn={false} />
    {routes.map(route => (
      <Route key={route.path} {...route} />
    ))}
  </Switch>
)

export default App
