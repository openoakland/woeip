import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Login } from "./login";
import { server, rest } from "../../serverHandlers";
import { apiUrlAuthLogin } from "../../api.util";
import { AuthTokenContext } from "./tokenContext";

describe("login", () => {
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

  it("should have the correct fields", () => {
    render(
      <AuthTokenContext.Provider value={{ setAuthToken: jest.fn() }}>
        <Router history={history}>
          <Login />
        </Router>
      </AuthTokenContext.Provider>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  it("should show the loading screen when signing in", async () => {
    server.use(
      rest.post(apiUrlAuthLogin(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ key: "fakeToken" }));
      })
    );

    const { container } = render(
      <AuthTokenContext.Provider value={{ setAuthToken: jest.fn() }}>
        <Router history={history}>
          <Login />
        </Router>
      </AuthTokenContext.Provider>
    );

    expect(container.querySelector(".loading")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() => {
      expect(container.querySelector(".loading")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(container.querySelector(".loading")).not.toBeInTheDocument();
    });
  });

  it("should set token and direct to upload after success", async () => {
    const setItemSpy = jest.spyOn(localStorage, "setItem");
    const setAuthToken = jest.fn();

    server.use(
      rest.post(apiUrlAuthLogin(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ key: "fakeToken" }));
      })
    );

    render(
      <AuthTokenContext.Provider value={{ setAuthToken }}>
        <Router history={history}>
          <Login />
        </Router>
      </AuthTokenContext.Provider>
    );

    fireEvent.click(screen.getByText("Sign In"));
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("authToken", "fakeToken");
      expect(setAuthToken).toHaveBeenCalledWith("fakeToken");
      expect(history.location.pathname).toBe("/upload");
    });
  });

  it("should show an alert after failure", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const setAuthToken = jest.fn();
    server.use(
      rest.post(apiUrlAuthLogin(), (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <AuthTokenContext.Provider value={{ setAuthToken }}>
        <Router history={history}>
          <Login />
        </Router>
      </AuthTokenContext.Provider>
    );

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(setAuthToken).not.toHaveBeenCalled();
    });
  });
});
