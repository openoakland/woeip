import { Route, Switch } from "react-router-dom";

import { Map } from "../map";
import { Upload } from "../upload";
import { Home } from "../home";
import { About } from "../about";
import { Login } from "../auth/login";
import { Logout } from "../auth/logout";

export const Navswitch = () => (
  <Switch>
    {routes.map((route) => (
      <Route key={route.path} {...route} />
    ))}
  </Switch>
);

/**
 * Route data: includes the components to render
 */
export const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/upload",
    exact: true,
    component: Upload,
  },
  {
    path: "/maps",
    exact: true,
    component: Map,
  },
  {
    path: "/about",
    exact: true,
    component: About,
  },
  {
    path: "/auth/login",
    exact: true,
    component: Login,
  },
  {
    path: "/auth/logout",
    exact: true,
    component: Logout,
  },
];
