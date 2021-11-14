import { Link, NavLink, withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Menu } from "../ui";
import { logout } from "../../../src/components/auth/utils";

let token = localStorage.getItem("access");
export const updateLoginStatus = () => {
  token = localStorage.getItem("access");
};

const Navbar = () => {
  /**
   * Data for Navigation Routes
   */
  const links = [
    { text: "Upload", route: "upload" },
    { text: "Maps", route: "maps" },
    { text: (token ? "Logout" : "Login"), route: "Login"},
  ];
  
  const toggle = (text) => {
    if (text === "Logout" && token) {
      logout();
      updateLoginStatus();
    }
  };
  return (
    <Container>
      <Menu pointing secondary style={{ borderBottom: "none" }}>
        <Menu.Menu position="left">
          <Menu.Item as={Link} to={"/"}>
            <h1>
              WO
              <br />
              AQ
            </h1>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {links.map(({ text, route }) => (
            <Menu.Item onClick={() => toggle(text)} key={route} as={NavLink} to={`/${route}`}>
              {text}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </Container>
  );
};

export const NavbarWithRouter = withRouter(Navbar);
