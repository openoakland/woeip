import { render, screen, fireEvent } from "@testing-library/react";
import { NavbarWithRouter } from "./bar";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("Navbar", () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
  });

  it("should contain three links", () => {
    renderWithRouter(history);
    expect(screen.getByText(/WOAQ/).href).toMatch("/");
    expect(screen.getByText(/Upload/).href).toMatch("/upload");
    expect(screen.getByText(/Maps/).href).toMatch("/maps");
  });

  it("should cycle through all pages, default on home page", () => {
    renderWithRouter(history);
    expect(history.location.pathname).toEqual("/");
    fireEvent.click(screen.getByText(/Upload/));
    expect(history.location.pathname).toEqual("/upload");
    fireEvent.click(screen.getByText(/Maps/));
    expect(history.location.pathname).toEqual("/maps");
    fireEvent.click(screen.getByText(/WOAQ/));
    expect(history.location.pathname).toEqual("/");
  });
});

const renderWithRouter = (history) => {
  return render(
    <Router history={history}>
      <NavbarWithRouter />
    </Router>
  );
};
