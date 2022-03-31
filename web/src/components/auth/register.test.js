import { fireEvent, render,screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Register } from "./register";
import { AuthTokenContext } from "./tokenContext";
import { server, rest } from "../../serverHandlers";
import { apiUrlAuthRegister } from "../../api.util";

describe("register", () => {
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
  })

  it("should have needed fields", () => {
    render(
      <AuthTokenContext.Provider value={{setAuthToken: jest.fn()}}>
        <Router history={history}>
          <Register/>
        </Router>
      </AuthTokenContext.Provider>
    );

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
  });

  it("should show message on password mismatch", () => {
    render(
      <AuthTokenContext.Provider value={{setAuthToken: jest.fn()}}>
        <Router history={history}>
          <Register/>
        </Router>
      </AuthTokenContext.Provider>
    );

    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");
    userEvent.type(password, 'abc');
    expect(screen.queryByText("passwords do not match")).not.toBeInTheDocument();
    userEvent.type(confirmPassword, 'a');
    expect(screen.getByText("passwords do not match")).toBeInTheDocument();
  });

  it("should should show loading styling when creating account", async () => {
    server.use(
      rest.post(apiUrlAuthRegister(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ key: "fakeToken"}));
      })
    );

    const {container} = render(
      <AuthTokenContext.Provider value={{setAuthToken : jest.fn()}}>
      <Router history={history}>
        <Register/>
      </Router>
    </AuthTokenContext.Provider>
    )

    expect(container.querySelector(".loading")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(container.querySelector(".loading")).toBeInTheDocument();
    })

    await waitFor(() => {
      expect(container.querySelector(".loading")).not.toBeInTheDocument();
    })
  });

  it("should set token and direct to about page, on registration success", async () => {
    const setItemSpy = jest.spyOn(localStorage, "setItem");
    const setAuthToken = jest.fn();

    server.use(
      rest.post(apiUrlAuthRegister(), (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({key: "fakeToken"}));
      })
    );

    render(
      <AuthTokenContext.Provider value={{ setAuthToken }}>
      <Router history={history}>
        <Register/>
      </Router>
    </AuthTokenContext.Provider>
    )

    fireEvent.click(screen.getByText("Create Account"));
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("authToken", "fakeToken");
      expect(setAuthToken).toHaveBeenCalledWith("fakeToken");
      expect(history.location.pathname).toBe("/about");
    });
  });

  it("should show an alert on registration failure", async () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const setAuthToken  = jest.fn();

    server.use(
      rest.post(apiUrlAuthRegister(), (_req, res, ctx) => {
        return res(ctx.status(400));
      })
    );

    render(
      <AuthTokenContext.Provider value={{ setAuthToken }}>
      <Router history={history}>
        <Register/>
      </Router>
    </AuthTokenContext.Provider>
    )

    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(setAuthToken).not.toHaveBeenCalled();
    });
  });
});
