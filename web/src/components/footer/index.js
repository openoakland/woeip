import { Grid, Menu, Image } from "../ui";
import "./index.css";

import woaqLogo from '../../images/WOAQ - Light Theme.svg'
import gitHubLogo from '../../images/GitHub_Logo_ Light_Theme.svg'
import ooLogo from '../../images/OpenOakland-logo-color.svg'
import woeipLogo from '../../images/cropped-WOEIP-logo-unofficial.png'

export const Footer = () => {
  const sharedMenuItemProps = {
    target: "_blank",
  }

  return (
    <Grid columns={3} id="footer">
      <Grid.Column>
        <Menu secondary>
          <Menu.Item
            href="https://github.com/openoakland/woeip"
            position="left"
            {...sharedMenuItemProps}
          >
            <Image src={woaqLogo} spaced="right"/> on <Image src={gitHubLogo} spaced="left" id="githubFooterLink"/>
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column>
        <Menu secondary>
          <Menu.Item
            className="center" // could add this to UI
            href="https://openoakland.org"
            {...sharedMenuItemProps}
          >
            Created by <Image src={ooLogo}/>
          </Menu.Item>
        </Menu>
      </Grid.Column>
      <Grid.Column>
        <Menu fluid secondary>
          <Menu.Item
            href="https://woeip.org"
            position="right"
            {...sharedMenuItemProps}
          >
            <Image src={woeipLogo}/>
          </Menu.Item>
        </Menu>
      </Grid.Column>
    </Grid>
  );
};