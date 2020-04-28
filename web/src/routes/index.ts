import Map from 'components/Map'
import Upload from 'components/Upload'
import Home from 'components/Home'

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
    path: '/about',
    exact: true,
    component: Home
  },
  {
    path: '/upload',
    exact: true,
    component: Upload
  },
  {
    path: '/maps',
    exact: true,
    component: Map
  }
]

export default routes
