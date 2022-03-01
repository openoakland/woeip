import { AuthBoundary } from "../auth/boundary";
import { Container } from "../ui";

export const Home = () => {
  return (
    <AuthBoundary>
      <Container textAlign="center">
        <h2>Welcome to West Oakland Air Quality!</h2>
      </Container>
    </AuthBoundary>
  );
};
