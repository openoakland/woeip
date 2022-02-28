import { useState } from "react";
import { Container } from "../ui";
import { login } from "./utils";

export const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  const updateUsername = (e) => setUsername(e.target.value);
  const updatePassword = (e) => setPassword(e.target.value);

  return (
    <Container textAlign="center">
      <h2>Login to continue</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:{" "}
          <input type="text" value={username} onChange={updateUsername} />
        </label>
        <label>
          Password:{" "}
          <input type="password" value={password} onChange={updatePassword} />
        </label>
        <input type="submit" value="Login" />
      </form>
    </Container>
  );
};
