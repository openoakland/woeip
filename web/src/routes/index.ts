import Map from 'components/Map'
import Upload from 'components/Upload'
import UploadConfirmation from 'components/Upload_Confirmation'
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
  },
  {
    path: '/confirm-upload',
    exact: true,
    component: UploadConfirmation
  }
]

export default routes
