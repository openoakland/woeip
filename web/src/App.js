import { useState, useEffect } from "react";
import { AuthTokenContext } from "./components/auth/tokenContext";
import { getAuthTokenItem } from "./components/auth/utils";
import { Navigation } from "./components/nav";
import { Footer } from "./components/footer";
import { Container } from "./components/ui";
import "./App.css";

// All components for the application are organized here.
export const App = () => {
  const [authToken, setAuthToken] = useState("");
  /**
   * Check local storage for auth token on initial application load.
   */
  useEffect(() => {
    setAuthToken(getAuthTokenItem());
  }, []);

  return (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      <Container className={"app-container"}>
        {/* Components that can be mounted via the Router are nested in Navigation */}
        <Navigation />
        <Footer />
      </Container>
    </AuthTokenContext.Provider>
  );
};
