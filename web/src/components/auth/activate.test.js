import { render, screen, fireEvent } from "@testing-library/react";
import { Activate } from "./activate";

describe("Activate", () => {
  it("should render the activate page", () => {
    const component = render(<Activate />);
    expect(screen.getByText(/Verify your account/)).toBeInTheDocument();
    expect(screen.getByText("Verify")).toBeInTheDocument();
  });
});
