import { render, screen } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Navswitch } from "./switch";

describe("Navswitch", () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(() => {
    history = null;
  });

  it("should render home by default", () => {
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
