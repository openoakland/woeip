import { Container, List } from "../ui";
import "./index.css";

export const Footer = () => {
  const footerLinks = links.map(({ name, url }) => (
    <List.Item key={name} as="a" href={url}>
      {name}
    </List.Item>
  ));

  return (
    <div className="footer-container">
      <Container>
        <List>{footerLinks}</List>
      </Container>
    </div>
  );
};

const links = [
  { name: "WOAQ on GitHub", url: "https://github.com/openoakland/woeip" },
  { name: "OpenOakland", url: "https://openoakland.org" },
  { name: "WOEIP", url: "https://woeip.org" },
];
