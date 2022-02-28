import { Navigation } from "./components/nav";
import { Footer } from "./components/footer";
import { Container } from "./components/ui";
import "./App.css";
import { useState, useEffect } from "react";
import { AuthTokenContext } from "./components/auth/tokenContext";
import { getAuthTokenItem } from "./components/auth/utils";

// All components for the application are organized here.
export const App = () => {
  /**
   * On initial application load,
   * check local storage for auth token
   */
  const [authToken, setAuthToken] = useState('');
  useEffect(() => {
    console.log('auth token item', getAuthTokenItem());
    setAuthToken(getAuthTokenItem());
  }, [])

  return (
    <AuthTokenContext.Provider value={authToken}>
      <Container className={"app-container"}>
        {/* Components that can be mounted via the Router are nested in Navigation */}
        <Navigation />
        <Footer />
      </Container>
    </AuthTokenContext.Provider>
  );
};
