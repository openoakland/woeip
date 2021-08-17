import { Container, DefaultInput, AffirmActionButton } from "../ui";

export const Login = () => {


  return (
    <div className="login-container">
      <Container>
        Username: <DefaultInput />
        <br />
        Password: <DefaultInput />
        <br />
        <AffirmActionButton>Sign In</AffirmActionButton>
      </Container>
    </div>
  );
};
