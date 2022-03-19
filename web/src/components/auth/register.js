import { useState, useContext, useEffect } from "react";
import { AuthTokenContext } from "./tokenContext";
import { register, setAuthTokenItem } from "./utils";
import { Link, useHistory } from "react-router-dom";
import { AffirmActionButton, Container, Form } from "../ui";
import Welcome from "../home/welcome";
import "./register.css";

const passwordMismatchError = {
  content: "passwords do not match",
  pointing: "above",
};

export const Register = () => {
  const history = useHistory();
  const { setAuthToken } = useContext(AuthTokenContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMismatched, setPasswordsMismatched] = useState(false);

  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);
  const changeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  useEffect(() => {
    setPasswordsMismatched(confirmPassword && password !== confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    const { token } = await register(email, password, confirmPassword);
    setIsRegistering(false);
    if (token) {
      setAuthToken(token);
      setAuthTokenItem(token);
      history.push("/about");
    } else {
      alert("Unable to register. Please check your credentials and try again.");
    }
  };

  return (
    <Container>
      <Welcome />
      <Container className="register-container">
        <Container className="register-instructions">
          <h2>Create an Account</h2>
          Or <Link to={"/auth/login"}>Sign in with existing account</Link>
        </Container>
        <Form loading={isRegistering} onSubmit={handleSubmit}>
          <Form.Input
            type="email"
            label="Email"
            width={6}
            value={email}
            onChange={changeEmail}
          />
          <Form.Input
            type="password"
            label="Password"
            width={6}
            value={password}
            onChange={changePassword}
          />
          <Form.Input
            type="password"
            label="Confirm Password"
            width={6}
            value={confirmPassword}
            onChange={changeConfirmPassword}
            error={passwordsMismatched ? passwordMismatchError : null}
          />
          <AffirmActionButton type="submit">Create Account</AffirmActionButton>
        </Form>
      </Container>
    </Container>
  );
};
