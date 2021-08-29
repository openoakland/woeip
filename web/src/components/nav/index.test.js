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
    render(<Navigation />);
    // Use quotes to get exact match, avoiding conflict with "WOAQ" in welcome message.
    fireEvent.click(screen.getByText("WOAQ"));
    expect(window.location.pathname).toEqual("/");
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
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
