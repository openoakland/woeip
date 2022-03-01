import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthTokenContext } from "./tokenContext";
import { clearAuthTokenItem, logout } from "./utils";
import { Container, Dimmer, Loader } from "../ui";

export const Logout = () => {
  const { authToken, setAuthToken } = useContext(AuthTokenContext);
  const [pending, setPending] = useState(true);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const { errored, code } = await logout(authToken);
      setPending(false);
      clearAuthTokenItem();
      setAuthToken("");
      if (!errored && code === 200) history.push("/auth/login");
    })();
    // Run once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // TODO: Loading and Error feedback
    <Container textAlign="center">
      <Dimmer active={pending}>
        <Loader indeterminate>Logging out...</Loader>
      </Dimmer>
    </Container>
  );
};
