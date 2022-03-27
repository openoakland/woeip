import { waitFor, render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { apiUrlAuthLogout } from "../../api.util";
import { server, rest } from "../../serverHandlers";
import { Logout } from "./logout";

describe("logout", () => {
  let history;

  beforeEach(() => {
    history = createMemoryHistory();

    const fakeLocalStorage = (function () {
      let store = {};

      return {
        getItem: function (key) {
          return store[key] || null;
        },
        setItem: function (key, value) {
          store[key] = value.toString();
        },
        removeItem: function (key) {
          delete store[key];
        },
        clear: function () {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: fakeLocalStorage,
    });
  });

  afterEach(() => {
    history = null;

    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("should show loader while logging out", async () => {
    server.use(
      rest.post(apiUrlAuthLogout(), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    await waitFor(() =>
      render(
        <Router history={history}>
          <Logout />
        </Router>
      )
    );
    await waitFor(() =>
      expect(screen.getByText(/Signing out/i)).toBeInTheDocument()
    );
  });

  it("should show login screen when successfully logged out", async () => {
    const removeItemSpy = jest.spyOn(localStorage, "removeItem");
    server.use(
      rest.post(apiUrlAuthLogout(), (_req, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    await waitFor(() =>
      render(
        <Router history={history}>
          <Logout />
        </Router>
      )
    );
    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalled();
      expect(history.location.pathname).toBe("/auth/login");
    });
  });

  it("should alert when failed to log out", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    server.use(
      rest.post(apiUrlAuthLogout(), (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Router history={history}>
        <Logout />
      </Router>
    );
    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(screen.getByText(/Signing Out/i)).toBeInTheDocument();
  });
});
