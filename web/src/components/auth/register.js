import React, { useState } from "react";
import { Form, AffirmActionButton } from "../ui";
import { Link, useHistory } from "react-router-dom";
import { register } from "./utils";
import "./register.css";

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const { firstName, lastName, email, password, rePassword } = formData;

  const history = useHistory();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password === rePassword) {
      const user = await register(
        firstName,
        lastName,
        email,
        password,
        rePassword
      );
      if (user && user.success) {
        history.push({
          pathname: "/login",
        });
      }
    }
  };

  return (
    <div className="register-container">
      <div className="instructions">
        <h2>Create an account</h2>
        <div className="register">
          <p>Already have an account?&nbsp;</p>
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </div>
      </div>
      <Form onSubmit={(e) => onSubmit(e)}>
        <Form.Field>
          <Form.Input
            label="First Name"
            placeholder="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Last Name"
            placeholder="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Email"
            placeholder="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Password"
            placeholder="Password"
            type="password"
            name="password"
            minLength="8"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            name="rePassword"
            minLength="8"
            value={rePassword}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <AffirmActionButton type="submit" color="grey">
          Create Account
        </AffirmActionButton>
      </Form>
    </div>
  );
};
