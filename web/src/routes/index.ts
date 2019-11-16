import Homepage from 'pages/Homepage'
import SignIn from 'pages/SignIn'

interface RouteConfig {
  path?: string
  exact?: boolean
  component: React.ComponentClass<any> | React.FunctionComponent<any>
}

const routes: RouteConfig[] = [
  {
    component: Homepage,
    path: '/',
    exact: true
  },
  {
    component: SignIn,
    path: '/login',
    exact: false
  }
]

export default routes
