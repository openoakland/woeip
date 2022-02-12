import React, { useState, useEffect } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { Container, Menu } from "../ui";
import { removeTokens } from "../../../src/components/auth/utils";
import { getAccessToken } from "../auth/utils";

const Navbar = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!token) {
      setToken(getAccessToken());
    }
  });

  /**
   * Data for Navigation Routes
   */
  const links = [
    { text: "Upload", route: "upload" },
    { text: "Maps", route: "maps" },
    { text: token ? "Sign out" : "Sign in", route: "Login" },
  ];

  const toggle = (text) => {
    if (text === "Sign out" && token) {
      removeTokens();
      setToken(null);
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
            <Menu.Item
              onClick={() => toggle(text)}
              key={route}
              as={NavLink}
              to={`/${route}`}
            >
              {text}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </Container>
  );
};

export const NavbarWithRouter = withRouter(Navbar);
