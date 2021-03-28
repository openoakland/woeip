import { BrowserRouter } from "react-router-dom";
import { Navswitch } from "./switch";
import { NavbarWithRouter } from "./bar";

export const Navigation = () => {
  return (
    <BrowserRouter>
      <NavbarWithRouter />
      {/* All components that can be navigated to 
      are rendered within the switch */}
      <Navswitch />
    </BrowserRouter>
  );
};
