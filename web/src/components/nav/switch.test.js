import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Navswitch } from "./switch";


/**
* gl-js used in "box" component has hard requirements for browser apis. it cannot run in jest
* https://github.com/mapbox/mapbox-gl-js/issues/10487#issuecomment-805106543
*/
jest.mock("../map/box", () => () => <></>);

// https://github.com/mapbox/mapbox-gl-js/issues/3436
jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn(),
    workerClass: jest.fn(),
  })),
  NavigationControl: jest.fn(),
}));

describe("Navswitch", () => {
  let history;
  beforeEach(() => {
    window.URL.createObjectURL = () => {};
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
  });

  it("should render home by default", () => {
    renderWithRouter(history);
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it("should render upload when navigating to route", () => {
    renderWithRouter(history);
    history.push("/upload");
    expect(screen.getByText(/DusTrak and GPS files/)).toBeInTheDocument();
  });

  // TODO: mock fetch for intial page render
  it.skip("should render map", () => {
    renderWithRouter(history);
    history.push("/maps");
  });
});

const renderWithRouter = (history) => {
  return render(
    <Router history={history}>
      <Navswitch />
    </Router>
  );
};
