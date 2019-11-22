import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import Home from './Home'
import 'semantic-ui-css/semantic.min.css'
import theme from 'theme'

const App = () => (
  <ThemeProvider theme={theme}>
    <Switch>
      <Route exact path='/' component={Home} />
    </Switch>
  </ThemeProvider>
)

export default App
