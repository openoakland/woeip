import { BrowserRouter } from "react-router-dom";
import { Navswitch } from "./switch";
import { NavbarWithRouter } from "./bar";
import { BetaNotice } from "./betaNotice";
import { Container } from "semantic-ui-react";

export const Navigation = () => {
  return (
    <BrowserRouter>
        <Container>
          <BetaNotice />
          <NavbarWithRouter />
        </Container>
        {/* All components that can be navigated to 
        are rendered within the switch */}
        <Navswitch />
      </BrowserRouter>
  );
};
