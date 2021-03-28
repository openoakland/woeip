import { render, screen } from "@testing-library/react";
import { Footer } from "./";

describe("Footer", () => {
  it("should have three external links", () => {
    render(<Footer />);
    expect(screen.getByText(/WOAQ on GitHub/).href).toEqual(
      "https://github.com/openoakland/woeip"
    );
    expect(screen.getByText(/WOEIP/).href).toEqual("https://woeip.org/");
    expect(screen.getByText(/OpenOakland/).href).toEqual(
      "https://openoakland.org/"
    );
  });
});
