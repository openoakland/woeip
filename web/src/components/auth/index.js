import { useContext, useState } from "react";
import { Login } from "./login";
import { AuthTokenContext } from "./tokenContext";

export const Auth = () => {
  const [authToken, setAuthToken] = useState(useContext(AuthTokenContext));
  return (
    <AuthTokenContext.Provider value={authToken}>
      {authToken ? <h2>Logout</h2> : <Login setToken={setAuthToken} />}
    </AuthTokenContext.Provider>
  );
};
