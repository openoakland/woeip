import Map from 'components/Map'

interface RouteConfig {
  path?: string
  exact?: boolean
  component: React.ComponentClass<any> | React.FunctionComponent<any>
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    exact: true,
    component: Map
  },
  {
    path: '/maps',
    exact: true,
    component: Map
  }
]

export default routes
