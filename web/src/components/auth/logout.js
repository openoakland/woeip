import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthTokenContext } from "./tokenContext";
import { clearAuthTokenItem, logout } from "./utils";
import { Container } from "../ui";

export const Logout = () => {
  const { authToken, setAuthToken } = useContext(AuthTokenContext);
  const [pending, setPending] = useState(true);
  const [errored, setErrored] = useState(false);
  const history = useHistory(); // TODO: push history to login

  useEffect(() => {
    (async () => {
      const { errored, code } = await logout(authToken);
      setErrored(errored);
      setPending(false);
      clearAuthTokenItem();
      setAuthToken("");
      if (!errored && code === 200) history.push("/auth/login");
    })();
  }, [authToken, history, setAuthToken]);

  return (
    // TODO: Loading and Error feedback
    <Container textAlign="center">
      {pending ? "pending\n" : "not pending"}
      {errored ? "errored" : "not errored "}
    </Container>
  );
};
