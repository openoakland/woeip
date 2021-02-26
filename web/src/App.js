import { Navigation } from "./components/nav";
import { Footer } from "./components/footer";
import { Container } from "./components/ui";
import "./App.css";

// All components for the application are organized here.
export const App = () => {
  return (
    <Container>
      {/* Components that can be mounted via the Router are nested in Navigation */}
      <Navigation />
      <Footer />
    </Container>
  );
};
