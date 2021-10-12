import { BrowserRouter } from "react-router-dom";
import { Navswitch } from "./switch";
import { NavbarWithRouter } from "./bar";
import { BetaNotice } from "./betaNotice";

export const Navigation = () => {
  return (
    <BrowserRouter>
      <BetaNotice />
      <NavbarWithRouter />
      {/* All components that can be navigated to 
      are rendered within the switch */}
      <Navswitch />
    </BrowserRouter>
  );
};
