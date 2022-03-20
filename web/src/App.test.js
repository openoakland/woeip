import { render, screen } from "@testing-library/react";
import { App } from "./App";

/**
 * gl-js used in "box" component has hard requirements for browser apis. it cannot run in jest
 * https://github.com/mapbox/mapbox-gl-js/issues/10487#issuecomment-805106543
 *
 *
 * Alternative fix at https://github.com/mapbox/mapbox-gl-js/issues/3436#issuecomment-485535598
 */
jest.mock("./components/map/box", () => () => <></>);

describe("Application should includes parts of each major section", () => {
  beforeEach(() => {
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
    localStorage.clear();
  });

  it("should not show a login screen", () => {
    localStorage.setItem("authToken", "fakeToken");
    render(<App />);
    expect(
      screen.queryByText(/Sign in to upload data/)
    ).not.toBeInTheDocument();
  });

  it("should have part of the header", () => {
    render(<App />);
    expect(screen.getByText(/Upload/).href).toMatch("/upload");
  });

  it("should have part of the body", () => {
    render(<App />);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it("should have part of the footer", () => {
    render(<App />);
    expect(screen.getByText(/WOEIP/).href).toEqual("https://woeip.org/");
  });

  it("should show a login screen", () => {
    render(<App />);
    expect(screen.getByText(/Sign in to upload data/)).toBeInTheDocument();
  });
});
