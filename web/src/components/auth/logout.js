import { useEffect, useState } from "react";
import { Container } from "../ui";
import { clearAuthTokenItem, logout } from "./utils";

// TODO: logout and return to Login page
export const Logout = ({authToken, setAuthToken}) => {
  const [pending, setPending] = useState(true);
  const [errored, setErrored] = useState(false);


  useEffect(() => {
    (async () => {
      console.log('authToken', authToken);
      const {errored, code} = await logout(authToken);
      console.log('logout errored', errored);
      console.log('logout code', code);
      setErrored(errored);
      setPending(false);
      clearAuthTokenItem();
      setAuthToken('');
    })();
  }, []);


  return (<Container textAlign="center">
    pending: {pending}
    errored: {errored}
  </Container>);
};
