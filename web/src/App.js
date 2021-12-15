import { Navigation } from "./components/nav";
import { Footer } from "./components/Footer";
import { Container } from "./components/ui";
import "./App.css";

// All components for the application are organized here.
export const App = () => {
  return (
    <Container className={"app-container"}>
      {/* Components that can be mounted via the Router are nested in Navigation */}
      <Navigation />
      <Footer />
    </Container>
  );
};
