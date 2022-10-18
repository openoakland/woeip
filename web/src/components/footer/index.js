import { Container, List } from "../ui";
import "./index.css";

export const Footer = () => {
  /**
   * Construct the Elements for the Links
   * @returns {Array<Element>}
   */
  const footerLinks = links.map(({ name, url }) => (
    <List.Item key={name} as="a" href={url}>
      {name}
    </List.Item>
  ));

  return (
    <Container>
      <List>{footerLinks}</List>
    </Container>
  );
};

/**
 * Store the data for the footer links
 */
const links = [
  { name: "WOAQ on GitHub", url: "https://github.com/openoakland/woeip" },
  { name: "OpenOakland", url: "https://openoakland.org" },
  { name: "WOEIP", url: "https://woeip.org" },
];
