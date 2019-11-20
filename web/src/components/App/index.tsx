import React from 'react'
import { Route, Switch } from 'react-router-dom'
import routes from 'routes'

const App = () => (
  <Switch>
    {routes.map(route => (
      <Route key={route.path} {...route} />
    ))}
  </Switch>
)

export default App
