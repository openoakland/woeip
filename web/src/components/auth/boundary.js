import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { Container } from "../ui";
import { AuthTokenContext } from "./tokenContext";

export const AuthBoundary = ({ children, ...props }) => {
  const { authToken, tokenLoading } = useContext(AuthTokenContext);
  return tokenLoading ? (
    <Container></Container>
  ) : (
    <Route
      {...props}
      render={({ location }) =>
        authToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
