import { Route, Switch } from "react-router-dom";

import { Map } from "../map";
import { Upload } from "../upload";
import { Home } from "../home";

export const Navswitch = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  );
};

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
];
