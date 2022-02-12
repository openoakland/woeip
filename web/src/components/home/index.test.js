import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Home } from "./";

describe("Home", () => {
  it("should show welcome message", () => {
    render(<Router><Home /></Router>);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });
});
