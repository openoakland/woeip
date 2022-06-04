import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "./";

/**
 * gl-js used in "box" component has hard requirements for browser apis. it cannot run in jest
 * https://github.com/mapbox/mapbox-gl-js/issues/10487#issuecomment-805106543
 * Mocking the whole map page also allows us to avoid mocking a network call
 */
jest.mock("../map", () => () => <></>);

/**
 * Reduce the error spam from UploadDrop by mocking its render.
 */
jest.mock("../upload", () => () => <></>);

describe("Navigation", () => {
  it("should stay on home page", () => {
    const result = render(<Navigation />);
    // from https://stackoverflow.com/questions/53003594/find-element-by-id-in-react-testing-library
    fireEvent.click(result.container.querySelector("#navlogo"));
    expect(window.location.pathname).toEqual("/");
    expect(screen.getByText(/West Oakland Air Quality/)).toBeInTheDocument();
  });

  it("should navigate to upload page", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByText(/Upload/));
    expect(window.location.pathname).toEqual("/upload");
  });

  it("should navigate to map page", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByText(/Maps/));
    expect(window.location.pathname).toEqual("/maps");
  });
});
