import Homepage from 'pages/Homepage'

interface RouteConfig {
  path?: string
  exact?: boolean
  component: React.ComponentClass<any> | React.FunctionComponent<any>
}

const routes: RouteConfig[] = [
  {
    component: Homepage,
    path: '/'
  }
]

export default routes
