import { useState } from "react";
import { Container } from "../ui";
import { login, setAuthTokenItem } from "./utils";

// TODO: setToken -> setAuthToken
export const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errored, code, token } = await login(email, password);
    console.error("errored", errored);
    console.warn("code", code);
    console.log("token", token);
    if (code === 200) {
      setToken(token);
      setAuthTokenItem(token);
    }
  };

  const changeUsername = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  return (
    <Container textAlign="center">
      <h2>Login to continue</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email: <input type="text" value={email} onChange={changeUsername} />
        </label>
        <label>
          Password:{" "}
          <input type="password" value={password} onChange={changePassword} />
        </label>
        <input type="submit" value="Login" />
      </form>
    </Container>
  );
};
