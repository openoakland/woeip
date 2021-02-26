import { BrowserRouter } from "react-router-dom";
import { Navswitch } from "./switch";
import { NavbarWithRouter } from "./bar";

export const Navigation = () => {
  return (
    <BrowserRouter>
      <NavbarWithRouter />
      <Navswitch />
    </BrowserRouter>
  );
};
