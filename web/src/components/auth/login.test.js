import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Login } from "./login";

describe("Login", () => {
  it("should render the login page", () => {
    const component = render(<Router><Login /></Router>);
    expect(screen.getByText(/Sign in to upload data/)).toBeInTheDocument();
    expect(screen.getByText(/Create an account/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password?/)).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();

    const emailInput = component.getByPlaceholderText(/Email/);
    fireEvent.change(emailInput, {target: {value: "Email"}});
    expect(emailInput.value).toBe("Email");

    const passwordInput = component.getByPlaceholderText(/Password/);
    fireEvent.change(passwordInput, {target: {value: "Password"}});
    expect(passwordInput.value).toBe("Password");

    const registerLink = component.getByText(/Create an account/);
    fireEvent.click(registerLink);

    const forgetPasswordLink = component.getByText(/Forgot your password?/);
    fireEvent.click(forgetPasswordLink);
  });
});
