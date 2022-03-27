import { render,screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Register } from "./register";
import { AuthTokenContext } from "./tokenContext";

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

  it.only("should show message on password mismatch", () => {
    render(
      <AuthTokenContext.Provider value={{setAuthToken: jest.fn()}}>
        <Router history={history}>
          <Register/>
        </Router>
      </AuthTokenContext.Provider>
    );

    const password = screen.getByText("Password").closest("input");
    const confirmPassword = screen.getByText("Confirm Password")
    // const input = screen.getByRole("input");
    console.log(password);
  });

  it.todo("should set token and direct to about page, on registration success");
  it.todo("should show an alert on registration failure");
});
