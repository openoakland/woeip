import { render, screen } from "@testing-library/react";
import { Home } from "./";

describe("Home", () => {
  it("should show welcome message", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });
});
