import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { AuthBoundary } from "./boundary";
import { AuthTokenContext } from "./tokenContext";

describe("boundary", () => {
  let history;
  let renderAuthBoundaryWithHistory;
  beforeEach(() => {
    history = createMemoryHistory();
    renderAuthBoundaryWithHistory = renderAuthBoundary(history);
  });

  afterEach(() => {
    history = null;
    renderAuthBoundaryWithHistory = null;
  });

  it("should show a placeholder while loading", () => {
    const { container } = renderAuthBoundaryWithHistory();
    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  // TODO: FIXME for auth issue
  it.skip("should redirect to login for anon user", () => {
    renderAuthBoundaryWithHistory({ tokenLoading: false });
    screen.debug();
  });

  it("should show child for authed user", () => {
    const { container } = renderAuthBoundaryWithHistory({
      authToken: "fakeToken",
      tokenLoading: false,
      children: <div className="child"></div>,
    });
    expect(container.querySelector(".child")).toBeInTheDocument();
  });
});

const renderAuthBoundary =
  (history) =>
  ({ authToken = "", tokenLoading = true, children = <></> } = {}) =>
    render(
      <AuthTokenContext.Provider value={{ authToken, tokenLoading }}>
        <Router history={history}>
          <AuthBoundary>{children}</AuthBoundary>
        </Router>
      </AuthTokenContext.Provider>
    );
