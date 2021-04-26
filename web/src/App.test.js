import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("renders a part of each component", () => {
  render(<App />);
  expect(screen.getByText("WOAQ").href).toMatch("/");
  expect(screen.getByText("Welcome to WOAQ!")).toBeInTheDocument();
  expect(screen.getByText("WOEIP").href).toEqual("https://woeip.org/");
});
