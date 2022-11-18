import { render, screen } from "@testing-library/react";
import { App } from "./App";

/**
 * gl-js used in "box" component has hard requirements for browser apis. it cannot run in jest
 * https://github.com/mapbox/mapbox-gl-js/issues/10487#issuecomment-805106543
 *
 *
 * Alternative fix at https://github.com/mapbox/mapbox-gl-js/issues/3436#issuecomment-485535598
 */
jest.mock("./components/map/box", () => () => <></>);

describe("Application should includes parts of each major section", () => {
  it("should have part of the header", () => {
    render(<App />);
    expect(screen.getByText(/Upload/).href).toMatch("/upload");
  });

  it("should have part of the body", () => {
    render(<App />);
    expect(screen.getByText(/West Oakland Air Quality/)).toBeInTheDocument();
  });

  it("should have part of the footer", () => {
    render(<App />);
    expect(screen.getByTestId("footer-link-github").href).toEqual(
      "https://github.com/openoakland/woeip"
    );
  });
});
