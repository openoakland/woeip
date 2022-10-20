import { Menu } from "../ui";
import "./index.css";

export const Footer = () => {
  const sharedProps = {
    target: "_blank",
    className: "footerLink"
  }

  return (
    <Menu secondary style={{ paddingTop: "auto" }} id="footer">
      <Menu.Item
        href="https://github.com/openoakland/woeip"
        position="left"
        {...sharedProps}
      >
        [WOAQ logo] on [GitHub logo]
      </Menu.Item>
      <Menu.Item
        href="https://openoakland.org"
        {...sharedProps}
      >
        Created by [OpenOakland logo]
      </Menu.Item>
      <Menu.Item
        href="https://woeip.org"
        position="right"
        {...sharedProps}
      >
        [WOEIP logo]
      </Menu.Item>
    </Menu>
  );
};