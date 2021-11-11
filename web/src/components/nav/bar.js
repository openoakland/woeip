import { Link, NavLink, withRouter } from "react-router-dom";
import { Container, Menu } from "../ui";
import { logout } from "../../../src/components/auth/utils";

const Navbar = () => {
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
const token = localStorage.getItem("access");
/**
 * Data for Navigation Routes
 */
const links = [
  { text: "About", route: "about" },
  { text: "Upload", route: "upload" },
  { text: "Maps", route: "maps" },
  { text: (token ? "Logout" : "Login"), route: "Login"},
];

const toggle = async (text) => {
  if (text = "Logout" && token) {
    await logout();
  }
}