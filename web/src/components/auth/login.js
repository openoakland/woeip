import React, { useState } from "react";
import { AffirmActionButton, Form, ErrorMessage } from "../ui"
import { Link, useHistory } from "react-router-dom";
import { login } from "./utils";
import "./login.css";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState(false);

  const history = useHistory();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const checkAccessAndSetMsg = (isAuthenticated) => {
    if (!isAuthenticated) {
      setErrorMsg(true);
    }

    if (isAuthenticated && errorMsg) {
      setErrorMsg(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const isAuthenticated = await login(email, password);

    checkAccessAndSetMsg(isAuthenticated);

    if (isAuthenticated) {
      history.push({
        pathname: "/",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="instructions">
        <h2>Sign in to upload data</h2>
        <div className="register">
          <p>Or&nbsp;</p>
          <Link to="/register" className="register-link">
            Create an account
          </Link>
        </div>
      </div>
      {errorMsg && (
        <ErrorMessage>Email and password do not match.</ErrorMessage>
      )}
      <Form onSubmit={(e) => onSubmit(e)}>
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
            value={password}
            onChange={(e) => onChange(e)}
          />
        </Form.Field>
        <AffirmActionButton type="submit" color="grey">
          Sign In
        </AffirmActionButton>
      </Form>
      <Link to="/reset-password" className="reset-password">
        Forgot your password?
      </Link>
    </div>
  );
};
