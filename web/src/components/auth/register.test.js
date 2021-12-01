import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Register } from "./register";

describe("Register", () => {
  it("should render the register page", () => {
    const component = render(<Router><Register /></Router>);
    expect(screen.getByText(/Create an account/)).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/First Name/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Last Name/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/)).toBeInTheDocument();
    expect(screen.getByText(/Create Account/)).toBeInTheDocument();

    const firstNameInput = component.getByPlaceholderText(/First Name/);
    fireEvent.change(firstNameInput, {target: {value: "First Name"}});
    expect(firstNameInput.value).toBe("First Name");

    const lastNameInput = component.getByPlaceholderText(/Last Name/);
    fireEvent.change(lastNameInput, {target: {value: "Last Name"}});
    expect(lastNameInput.value).toBe("Last Name");

    const emailInput = component.getByPlaceholderText(/Email/);
    fireEvent.change(emailInput, {target: {value: "Email"}});
    expect(emailInput.value).toBe("Email");

    const passwordInput = component.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, {target: {value: "Password"}});
    expect(passwordInput.value).toBe("Password");

    const confirmPasswordInput = component.getByPlaceholderText(/Confirm Password/);
    fireEvent.change(confirmPasswordInput, {target: {value: "Confirm Password"}});
    expect(confirmPasswordInput.value).toBe("Confirm Password");

    const loginLink = component.getByText(/Sign in/);
    fireEvent.click(loginLink);
  });
});
