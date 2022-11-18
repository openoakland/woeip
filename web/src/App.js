import { Navigation } from "./components/nav";
import { Footer } from "./components/footer";
import "./App.css";

// All components for the application are organized here.
export const App = () => {
  return (
    <div id="app-container">
      {/* Components that can be mounted via the Router are nested in Navigation */}
      <Navigation />
      <Footer />
    </div>
  );
};
