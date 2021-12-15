import { Route, Switch } from "react-router-dom";

import { Map } from "../Map";
import { Upload } from "../upload";
import { Home } from "../Home";
import { Login } from "../auth/login";
import { Register } from "../auth/register";
import { ResetPassword } from "../auth/resetPassword";
import { ResetPasswordConfirm } from "../auth/resetPasswordConfirm";
import { Activate } from "../auth/activate";
import { About } from "../about";

export const Navswitch = () => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  );
};

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
    path: "/login",
    exact: true,
    component: Login,
  },
  {
    path: "/register",
    exact: true,
    component: Register,
  },
  {
    path: "/reset-password",
    exact: true,
    component: ResetPassword,
  },
  {
    path: "/password/reset/confirm/:uid/:token",
    exact: true,
    component: ResetPasswordConfirm,
  },
  {
    path: "/activate/:uid/:token",
    exact: true,
    component: Activate,
  },
];
