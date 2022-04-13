import { useContext, useEffect, useState } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import { AuthTokenContext } from "../auth/tokenContext";
import { Container, Menu } from "../ui";

const Navbar = () => {
  const { authToken, isTokenLoading } = useContext(AuthTokenContext);
  const [links, setLinks] = useState([]);
  // Wait to return navigation links until token finishes loading
  useEffect(
    () => setLinks(isTokenLoading ? [] : activeHeaderLinks(authToken)),
    [isTokenLoading, authToken]
  );

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
            <Menu.Item key={route} as={NavLink} to={`/${route}`}>
              {text}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </Container>
  );
};

export const NavbarWithRouter = withRouter(Navbar);

/**
 * Data for Navigation Routes
 */
const allHeaderLinks = [
  { text: "About", route: "about" },
  { text: "Upload", route: "upload" },
  { text: "Maps", route: "maps" },
  { text: "Sign In", route: "auth/login" },
  { text: "Log Out", route: "auth/logout" },
];

const activeHeaderLinks = (authToken) => {
  const filteredLink = authToken ? "Sign In" : "Log Out";
  return allHeaderLinks.filter((link) => link.text !== filteredLink);
};
