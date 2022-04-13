import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AuthTokenContext } from "../auth/tokenContext";
import { Home } from "./";

describe("Home", () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
  });

  it("should show welcome message", () => {
    render(
      <AuthTokenContext.Provider value={{ authToken: "fakeToken" }}>
        <Router history={history}>
          <Home />
        </Router>
      </AuthTokenContext.Provider>
    );
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });
});
