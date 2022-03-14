import { useState, useContext, useEffect } from "react";
import { AuthTokenContext } from "./tokenContext";
import { register, setAuthTokenItem } from "./utils";
import { Link, useHistory } from "react-router-dom";
import { Container, Dimmer, Loader } from "../ui";

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
    <Container textAlign="center">
      <Dimmer active={isRegistering}>
        <Loader indeterminate />
        Registering...
      </Dimmer>
      <h2>Register</h2>
      <Link to={"/auth/login"}>Login with existing account</Link>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={changeEmail} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={changePassword} />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={changeConfirmPassword}
          />
          <p>{passwordsMismatched && "passwords do not match"}</p>
        </label>
        <input type="submit" value="Register" />
      </form>
    </Container>
  );
};
