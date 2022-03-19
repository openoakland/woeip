import { AuthBoundary } from "../auth/boundary";
import Welcome from './welcome';

export const Home = () => {
  return (
    <AuthBoundary>
      <Welcome />
    </AuthBoundary>
  );
};
