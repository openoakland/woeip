import Map from '../components/Map'
import Home from '../Home'

interface RouteConfig {
  path?: string
  exact?: boolean
  component: React.ComponentClass<any> | React.FunctionComponent<any>
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/maps',
    exact: true,
    component: Map
  }
]

export default routes
