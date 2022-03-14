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
      const { succeeded } = await logout(authToken);
      setPending(false);
      if (succeeded) {
        clearAuthTokenItem();
        setAuthToken("");
        history.push("/auth/login");
      } else {
        alert("Unable to logout. Please reload page to try again.");
      }
    })();
    // Run once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container textAlign="center">
      <Dimmer active={pending}>
        <Loader indeterminate>Logging out...</Loader>
      </Dimmer>
    </Container>
  );
};
