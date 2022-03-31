import { useContext, useState } from "react";
import { AuthTokenContext } from "./tokenContext";
import { login, setAuthTokenItem } from "./utils";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, AffirmActionButton } from "../ui";
import Welcome from "../home/welcome";
import "./login.css";

export const Login = () => {
  const { setAuthToken } = useContext(AuthTokenContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { token } = await login(email, password);
    setIsLoading(false);
    if (token) {
      setAuthToken(token);
      setAuthTokenItem(token);
      history.push("/upload");
    } else {
      alert("Unable to login. Please check your credentials and try again.");
    }
  };

  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  return (
    <Container>
      <Welcome />
      <Container className="login-container">
        <Container className="login-instructions">
          <h2>Sign in to upload data</h2>
          Or <Link to={"/auth/register"}>Create an Account</Link>
        </Container>
        <Form loading={isLoading} onSubmit={handleSubmit}>
          <Form.Input
            id="loginEmail"
            htmlFor="loginEmail"
            type="email"
            label="Email"
            width={6}
            value={email}
            onChange={changeEmail}
          />
          <Form.Input
            id="loginEmail"
            htmlFor="loginEmail"
            type="password"
            label="Password"
            width={6}
            value={password}
            onChange={changePassword}
          />
          <AffirmActionButton type="submit">Sign In</AffirmActionButton>
        </Form>
      </Container>
    </Container>
  );
};
