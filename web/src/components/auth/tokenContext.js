import { createContext } from "react";

export const AuthTokenContext = createContext({
  authToken: "",
  tokenLoading: false,
  setAuthToken: () => {},
});
