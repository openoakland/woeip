import { Container, DefaultInput, AffirmActionButton } from "../ui";

export const Register = () => {


  return (
    <div className="register-container">
      <Container>
        Username: <DefaultInput />
        <br />
        Email: <DefaultInput />
        <br />
        Password: <DefaultInput />
        <br />
        <AffirmActionButton>Create Account</AffirmActionButton>
      </Container>
    </div>
  );
};
