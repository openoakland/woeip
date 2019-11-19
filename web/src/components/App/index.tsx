import styled from '@emotion/styled'
import Navbar from 'containers/Header'
import { ThemeProvider } from 'emotion-theming'
import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import routes from 'routes'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import TruckHero from 'images/truckshero.png'
import { withRouter } from 'react-router-dom'

// Sets hero container for home page
let HeroContainer = {
  background: `url(${TruckHero}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  height: '100%'
}

const BoundingContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const App = props => {
  // Get path so we can change background based on what page we are on
  let path = props.location.pathname
  return (
    <ThemeProvider theme={{}}>
      <div style={path != '/' ? {} : HeroContainer}>
        <BoundingContainer>
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
        </BoundingContainer>
      </div>
    </ThemeProvider>
  )
}

export default withRouter(App)
