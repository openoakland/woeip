import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "./";

describe("Navigation", () => {
  it("should stay on home page", () => {
    render(<Navigation />);
    // Use quotes to get exact match, avoiding conflict with "WOAQ" in welcome message.
    fireEvent.click(screen.getByText("WOAQ"));
    expect(window.location.pathname).toEqual("/");
    expect(screen.getByText(/Welcome to WOAQ!/)).toBeInTheDocument();
  });

  // TODO: Update with upload component
  it.skip("should navigate to upload page", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByText(/Upload/));
    expect(window.location.pathname).toEqual("/upload");
  });

  // TODO: Update with map component
  it.skip("should navigate to map page", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByText(/Maps/));
    expect(window.location.pathname).toEqual("/maps");
  });
});
