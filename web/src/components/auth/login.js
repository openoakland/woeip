import { useContext, useState } from "react";
import { AuthTokenContext } from "./tokenContext";
import { login, setAuthTokenItem } from "./utils";
import { useHistory } from "react-router-dom";
import { Container } from "../ui";

export const Login = () => {
  const { setAuthToken } = useContext(AuthTokenContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errored, code, token } = await login(email, password);
    if (!errored && code === 200) {
      setAuthToken(token);
      setAuthTokenItem(token);
      history.push("/upload");
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
