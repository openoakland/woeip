import { Grid, Menu, Image } from "../ui";
import "./index.css";

import woaqLogo from "../../images/WOAQ - Light Theme.svg";
import gitHubLogo from "../../images/GitHub_Logo_ Light_Theme.svg";
import ooLogo from "../../images/OpenOakland-logo-color.svg";
import woeipLogo from "../../images/cropped-WOEIP-logo-unofficial.png";

export const Footer = () => {
  const sharedMenuItemProps = {
    target: "_blank",
  };

  return (
    <Grid columns={3} id="footer">
      <Grid.Column>
        <Menu secondary>
          <Menu.Item
            data-testid="footer-link-github"
            href="https://github.com/openoakland/woeip"
            position="left"
            {...sharedMenuItemProps}
          >
            <Image src={woaqLogo} spaced="right" alt="WOAQ logo" /> on{" "}
            <Image
              src={gitHubLogo}
              spaced="left"
              id="footerImgGithub"
              alt="GitHub logo"
            />
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column>
        <Menu secondary>
          <Menu.Item
            data-testid="footer-link-oo"
            className="center" // could add this to UI
            href="https://openoakland.org"
            {...sharedMenuItemProps}
          >
            Created by <Image src={ooLogo} alt="Open Oakland logo" />
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column>
        <Menu fluid secondary>
          <Menu.Item
            data-testid="footer-link-woeip"
            href="https://woeip.org"
            position="right"
            {...sharedMenuItemProps}
          >
            <Image src={woeipLogo} alt="WOEIP name and weathervane logo" />
          </Menu.Item>
        </Menu>
      </Grid.Column>
    </Grid>
  );
};
