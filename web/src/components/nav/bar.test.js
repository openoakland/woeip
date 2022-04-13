import { render, screen, fireEvent } from "@testing-library/react";
import { NavbarWithRouter } from "./bar";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AuthTokenContext } from "../auth/tokenContext";

describe("Navbar", () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
  });

  it("should contain four links, including logout", () => {
    renderWithRouter({ history });
    expect(screen.getByText(/WO/).closest("a").href).toMatch("/");
    expect(screen.getByText(/Upload/).href).toMatch("/upload");
    expect(screen.getByText(/Maps/).href).toMatch("/maps");
    expect(screen.getByText(/Log Out/).href).toMatch("/auth/logout");
  });

  it("should contain signin link", () => {
    renderWithRouter({ history, authToken: "" });
    expect(screen.getByText(/Sign In/).href).toMatch("/auth/login");
  });

  it("should cycle through all pages, default on home page", () => {
    renderWithRouter({ history });
    expect(history.location.pathname).toEqual("/");
    fireEvent.click(screen.getByText(/Upload/));
    expect(history.location.pathname).toEqual("/upload");
    fireEvent.click(screen.getByText(/Maps/));
    expect(history.location.pathname).toEqual("/maps");
    fireEvent.click(screen.getByText(/WOAQ/).closest("a"));
    expect(history.location.pathname).toEqual("/");
    fireEvent.click(screen.getByText(/Log Out/));
    expect(history.location.pathname).toEqual("/auth/logout");
  });

  it("should direct to sign in link", () => {
    renderWithRouter({ history, authToken: "" });
    fireEvent.click(screen.getByText(/Sign In/));
    expect(history.location.pathname).toEqual("/auth/login");
  });
});

const renderWithRouter = ({ history, authToken = "fakeToken" } = {}) => {
  return render(
    <AuthTokenContext.Provider value={{ authToken }}>
      <Router history={history}>
        <NavbarWithRouter />
      </Router>
    </AuthTokenContext.Provider>
  );
};
