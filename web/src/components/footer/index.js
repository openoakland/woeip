import { Segment, Grid } from "../ui";
import "./index.css";

export const Footer = () => {
  /**
   * Construct the Elements for the Links
   * @returns {Array<Element>}
   */
  const footerLinks = links.map(({ name, url, textAlign }) => (
    <Grid.Column key={name} as="a" href={url} textAlign={textAlign}>
      {name}
    </Grid.Column>
  ));

  return (
    <Segment id="footer">
        <Grid columns={3}>{footerLinks}</Grid>
    </Segment>
  );
};

/**
 * Store the data for the footer links
 */
const links = [
  {
    name: "WOAQ on GitHub",
    url: "https://github.com/openoakland/woeip",
    textAlign: "left" },
  {
    name: "OpenOakland",
    url: "https://openoakland.org",
    textAlign: "center"
  },
  {
    name: "WOEIP",
    url: "https://woeip.org",
    textAlign: "right"
  },
];
