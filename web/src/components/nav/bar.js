import { Link, NavLink, withRouter } from "react-router-dom";
import { Container, Menu } from "../ui";

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
            <Menu.Item
              // className="menu-item"
              key={route}
              // name={route}
              // link={true}
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

const links = [
  { text: "Upload", route: "upload" },
  { text: "Maps", route: "maps" },
];
