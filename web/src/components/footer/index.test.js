import { render, screen } from "@testing-library/react";
import { Footer } from "./";

describe("Footer", () => {
  it("should have three external links", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-link-github").href).toEqual(
      "https://github.com/openoakland/woeip"
    );
    expect(screen.getByTestId("footer-link-oo").href).toEqual("https://openoakland.org/");
    expect(screen.getByTestId("footer-link-woeip").href).toEqual(
      "https://woeip.org/"
    );
  });
});
