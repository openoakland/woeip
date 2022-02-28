import { useContext, useState } from "react";
import { Login } from "./login";
import { Logout } from "./logout";
import { AuthTokenContext } from "./tokenContext";

export const Auth = () => {
  const [authToken, setAuthToken] = useState(useContext(AuthTokenContext));
  console.log('authToken in auth app', authToken);
  return (
    <AuthTokenContext.Provider value={authToken}>
      {authToken ? <Logout authToken={authToken} setAuthToken={setAuthToken}/> : <Login setToken={setAuthToken} />}
    </AuthTokenContext.Provider>
  );
};
