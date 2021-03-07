import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Navswitch } from "./switch";
import mapboxgl from "mapbox-gl";

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

  it.skip("should render home by default", () => {
    // const mockUrl = jest.spyOn(window.URL, "createObjectURL");
    // window.URL.createObjectURL = () => {}
    renderWithRouter(history);
    expect(screen.getByText(/Welcome to WOAQ!/)).toBeInTheDocument();
  });

  // Update with Upload component
  it.skip("should render upload", () => {
    renderWithRouter(history);
    history.push("/upload");
  });

  // Update with Map component
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
