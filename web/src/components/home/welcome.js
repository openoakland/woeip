import { Container } from "../ui";
import "./welcome.css";

export default function Welcome() {
  return (
    <Container>
      <h1>Welcome to WOAQ!</h1>
      <p className="welcome-intro">
        West Oakland Air Quality supports the West Oakland Environmental
        Indicators Project by putting local air quality in the hands of West
        Oaklanders.
      </p>
    </Container>
  );
}
